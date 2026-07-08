# Script Templates

Canonical, fully-annotated examples of the section layout. Copy the shape, not the content. Omit any subsection that would be empty — never leave placeholder headers.

## Server Script

```lua
--!strict

-- // VARIABLES // --

-- | Services | --
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerStorage = game:GetService("ServerStorage")
local RunService = game:GetService("RunService")

-- | Modules | --
-- Ordered: ServerScriptService -> ServerStorage -> ReplicatedStorage -> Workspace
local PlayerData = require(ServerStorage.Modules.PlayerData)
local Config = require(ReplicatedStorage.Shared.Config)
local Signal = require(ReplicatedStorage.Shared.Signal)

-- | Objects | --
local remotes = ReplicatedStorage:WaitForChild("Remotes")
local purchaseRemote = remotes:WaitForChild("Purchase") :: RemoteEvent
local spawnPoints = workspace:WaitForChild("SpawnPoints")

-- | Configuration | --
local MAX_PURCHASES_PER_MINUTE = 10
local RESPAWN_DELAY = 3
local SAVE_INTERVAL = 120

-- | State Management | --
local purchaseCounts: {[Player]: number} = {}
local playerConnections: {[Player]: {RBXScriptConnection}} = {}
local isShuttingDown = false

-- // FUNCTIONS // --

--[[
	Handles a purchase request coming from a client, rejecting anything invalid.

	@param itemId Untrusted client argument; validated before use
]]
local function onPurchaseRequest(player: Player, itemId: unknown)
	if typeof(itemId) ~= "string" then return end
	local count = purchaseCounts[player] or 0
	if count >= MAX_PURCHASES_PER_MINUTE then return end
	purchaseCounts[player] = count + 1
	-- ... server-side validation of price/ownership, then grant
end

--[[
	Prepares everything a newly joined player needs.
]]
local function onPlayerAdded(player: Player)
	purchaseCounts[player] = 0
	playerConnections[player] = {}
	PlayerData.Load(player)
end

--[[
	Releases everything owned by a leaving player.
]]
local function onPlayerRemoving(player: Player)
	PlayerData.Save(player)
	for _, connection in playerConnections[player] or {} do
		connection:Disconnect()
	end
	playerConnections[player] = nil
	purchaseCounts[player] = nil
end

--[[
	Finalizes pending state so the server can shut down safely.
]]
local function onClose()
	isShuttingDown = true
	PlayerData.SaveAll()
end

-- // INITIALIZATION // --

-- | Player Events | --
Players.PlayerAdded:Connect(onPlayerAdded)
Players.PlayerRemoving:Connect(onPlayerRemoving)
for _, player in Players:GetPlayers() do -- players who joined before this script ran
	task.spawn(onPlayerAdded, player)
end

-- | Remotes | --
purchaseRemote.OnServerEvent:Connect(onPurchaseRequest)

-- | Lifecycle | --
game:BindToClose(onClose)
```

## ModuleScript

```lua
--!strict

-- // VARIABLES // --

-- | Services | --
local DataStoreService = game:GetService("DataStoreService")
local Players = game:GetService("Players")

-- | Modules | --
local DeepCopy = require(script.Parent.DeepCopy)

-- | Configuration | --
local STORE_NAME = "PlayerData_v1"
local MAX_RETRIES = 3
local RETRY_BASE_DELAY = 1

-- | State Management | --
local store = DataStoreService:GetDataStore(STORE_NAME)
local sessionCache: {[Player]: {[string]: any}} = {}

local PlayerData = {}

-- // FUNCTIONS // --

-- | Private | --

--[[
	Runs a fallible operation under this module's retry policy.

	@param fn The operation to attempt; may be retried multiple times
	@return Whether it eventually succeeded, followed by its results
]]
local function withRetry<T...>(fn: () -> T...): (boolean, T...)
	for attempt = 1, MAX_RETRIES do
		local results = table.pack(pcall(fn))
		if results[1] then
			return table.unpack(results) :: any
		end
		task.wait(RETRY_BASE_DELAY * 2 ^ (attempt - 1))
	end
	return false
end

-- | Public | --

--[[
	Makes the player's persistent data available for this session.
]]
function PlayerData.Load(player: Player)
	local ok, data = withRetry(function()
		return store:GetAsync(`player_{player.UserId}`)
	end)
	sessionCache[player] = if ok and data then data else DeepCopy(PlayerData.Defaults)
end

--[[
	Persists the player's session data and releases it.
]]
function PlayerData.Save(player: Player)
	local data = sessionCache[player]
	if not data then return end
	withRetry(function()
		store:UpdateAsync(`player_{player.UserId}`, function()
			return data
		end)
	end)
	sessionCache[player] = nil
end

--[[
	Persists the data of every active player (typically on shutdown).
]]
function PlayerData.SaveAll()
	for player in sessionCache do
		task.spawn(PlayerData.Save, player)
	end
end

-- // INITIALIZATION // --

PlayerData.Defaults = {
	coins = 0,
	level = 1,
}

return PlayerData
```

## LocalScript

```lua
--!strict

-- // VARIABLES // --

-- | Services | --
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")
local TweenService = game:GetService("TweenService")

-- | Modules | --
local Config = require(ReplicatedStorage.Shared.Config)

-- | Objects | --
local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")
local hud = playerGui:WaitForChild("HUD")
local coinLabel = hud:WaitForChild("CoinLabel") :: TextLabel

-- | Configuration | --
local COIN_TWEEN_INFO = TweenInfo.new(0.3, Enum.EasingStyle.Quad)

-- | State Management | --
local displayedCoins = 0

-- // FUNCTIONS // --

--[[
	Synchronizes the coin display with the player's current state.
]]
local function updateCoinDisplay()
	local coins = player:GetAttribute("Coins") or 0
	if coins == displayedCoins then return end
	displayedCoins = coins
	coinLabel.Text = tostring(coins)
end

-- // INITIALIZATION // --

player:GetAttributeChangedSignal("Coins"):Connect(updateCoinDisplay)
updateCoinDisplay()
```

## Notes on the templates

- The ModuleScript's table (`local PlayerData = {}`) lives at the end of State Management; static data assigned to it (like `Defaults`) may be set in INITIALIZATION.
- `table.pack`/`table.unpack` in `withRetry` is acceptable here because retries are rare-path; never do this in a hot loop.
- The LocalScript reads state via Attributes rather than a RemoteEvent — prefer attribute/tag replication for simple state; reserve remotes for actions.
