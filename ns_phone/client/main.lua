ESX = nil

Citizen.CreateThread(function()
    while ESX == nil do
        TriggerEvent(Config.ClientESXTrigger, function(obj)
            ESX = obj
        end)
    end
end)
local isOpen = false

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(10)
        if Config.NeedItem then
            if IsControlJustPressed(0, Config.OpenKey) then
                ESX.TriggerServerCallback('ns_phone:itemCheck', function(cb)
                    if cb then
                        SendNUIMessage({
                            action = 'openPhone'
                        })
                        SetNuiFocus(true, true)
                        Animation()
                        isOpen = true
                        TriggerServerEvent('ns_phone:getSettings')
                        TriggerServerEvent('ns_phone:getNotifications')
                    else
                        -- TODO
                        ESX.ShowNotification(Config.Translations[Config.Locale]['needed_phone'])
                    end
                end)
            end
        else
            if IsControlJustPressed(0, Config.OpenKey) then
                SendNUIMessage({
                    action = 'openPhone'
                })
                SetNuiFocus(true, true)
                isOpen = true
                Animation()
                TriggerServerEvent('ns_phone:getSettings')
                TriggerServerEvent('ns_phone:getNotifications')
            end
        end
    end
end)
RegisterNetEvent('ns_phone:forceOpen')
AddEventHandler('ns_phone:forceOpen', function()
    SendNUIMessage({
        action = 'openPhone'
    })
    SetNuiFocus(true, true)
    Animation()
    isOpen = true
    TriggerServerEvent('ns_phone:getSettings')
    TriggerServerEvent('ns_phone:getNotifications')
end)

RegisterNetEvent('ns_phone:startCallFromOther')
AddEventHandler('ns_phone:startCallFromOther', function(number)
    SendNUIMessage({
        action = "startCallFromOther",
        number = number
    })
end)

RegisterNUICallback('closePhone', function()
    SetNuiFocus(false, false)
    stopAnimation()
    isOpen = false
end)

Citizen.CreateThread(function()
    while true do
        if isOpen then
            ESX.TriggerServerCallback('ns_phone:getTime', function(cb)
                SendNUIMessage({
                    action = "currentTime",
                    time = cb
                })
            end)
        end
        Citizen.Wait(5000)
    end
end)


RegisterNUICallback('getSettings', function()
    TriggerServerEvent('ns_phone:getSettings')
end)

RegisterNetEvent('ns_phone:setSettings')
AddEventHandler('ns_phone:setSettings', function(data)
    SendNUIMessage({
        action = 'setSettings',
        data = data
    })
end)

RegisterNUICallback('updateData', function(data)
    if data.type == 'changeBackground' then
        TriggerServerEvent('ns_phone:changeBackground', data.input)
    elseif data.type == 'changeLockscreen' then
        TriggerServerEvent('ns_phone:changeLockscreen', data.input)
    end
end)

RegisterNetEvent('ns_phone:setNotifications')
AddEventHandler('ns_phone:setNotifications', function(notifications)
    SendNUIMessage({
        action = 'setNotifications',
        notifications = notifications
    })
end)

RegisterNUICallback('toggleFlyMode', function(data)
    TriggerServerEvent('ns_phone:toggleFlyMode', data.flyMode)
end)

RegisterNetEvent('ns_phone:sendNotification')
AddEventHandler('ns_phone:sendNotification', function(message, title)
    sendNotification(message, title)
end)

function sendNotification(message, title)
    SendNUIMessage({
        action = "sendNotification",
        message = message,
        title = title
    })
end

RegisterNUICallback('toggleSounds', function(data)
    TriggerServerEvent('ns_phone:toggleSounds', data.sounds)
end)

RegisterNUICallback('saveContact', function(data)
    TriggerServerEvent('ns_phone:saveContact', data.name, data.number, data.profile_picture, data.email)
end)

RegisterNetEvent('ns_phone:setContacts')
AddEventHandler('ns_phone:setContacts', function(contacts)
    SendNUIMessage({
        action = 'setContacts',
        contacts = contacts
    })
end)

RegisterNUICallback('toggleFavourite', function(data)
    TriggerServerEvent('ns_phone:toggleFavourite', data.id)
end)

RegisterNUICallback('getMessageList', function()
    TriggerServerEvent('ns_phone:getMessageList')
end)

RegisterNetEvent('ns_phone:setMessageList')
AddEventHandler('ns_phone:setMessageList', function(messages, user)
    SendNUIMessage({
        action = 'setMessageList',
        messages = messages,
        user = user
    })
end)

RegisterNUICallback('getSingleMessages', function(data)
    TriggerServerEvent('ns_phone:getSingleMessages', data.id, data.receiver, data.name)
end)

RegisterNetEvent('ns_phone:setSingleMessages')
AddEventHandler('ns_phone:setSingleMessages', function(messages, user, id)
    print(id)
    SendNUIMessage({
        action = "setSingleMessages",
        messages = messages,
        user = user,
        id = id
    })
end)

RegisterNUICallback('addMessage', function(data)
    TriggerServerEvent('ns_phone:addMessage', data.id, data.message, data.receiver)
end)

RegisterNUICallback('createMessage', function(data)
    print(data.id)
    TriggerServerEvent('ns_phone:createMessage', data.id, data.name)
end)

RegisterNetEvent('ns_phone:openExistingChat')
AddEventHandler('ns_phone:openExistingChat', function(id, receiver, name)
    SendNUIMessage({
        action = 'openExistingChat',
        id = id,
        receiver = receiver,
        name = name
    })
end)

RegisterNetEvent('ns_phone:createNewChat', function(id, receiver, name)
    SendNUIMessage({
        action = 'createNewChat',
        id = id,
        receiver = receiver,
        name = name,
    })
end)

RegisterNUICallback('createChat', function(data)
    TriggerServerEvent('ns_phone:createChat', data.receiver, data.message)
end)

RegisterNetEvent('ns_phone:chatCreated')
AddEventHandler('ns_phone:chatCreated', function(id)
    SendNUIMessage({
        action = "chatCreated",
        id = id
    })
end)

RegisterNetEvent('ns_phone:setNotes')
AddEventHandler('ns_phone:setNotes', function(notes)
    SendNUIMessage({
        action = 'setNotes',
        notes = notes
    })
end)

RegisterNUICallback('getNotes', function()
    TriggerServerEvent('ns_phone:getNotes')
end)

RegisterNUICallback('createNote', function(data)
    TriggerServerEvent('ns_phone:createNote', data.text, data.title)
end)

RegisterNUICallback('updateNote', function(data)
    TriggerServerEvent('ns_phone:updateNote', data.text, data.title, data.id)
end)

RegisterNUICallback('deleteNote', function(data)
    TriggerServerEvent('ns_phone:deleteNote', data.id)
end)

RegisterNUICallback('createCall', function(data)
    TriggerServerEvent('ns_phone:createCall', data.receiver)
end)

RegisterNetEvent('ns_phone:sendToReceiver')
AddEventHandler('ns_phone:sendToReceiver', function(contact, caller)
    SendNUIMessage({
        action = "sendToReceiver",
        contact = contact,
        caller = caller
    })
end)

RegisterNUICallback('rejectCall', function(data)
    TriggerServerEvent('ns_phone:rejectCall', data.caller)
end)

RegisterNetEvent('ns_phone:rejectCall')
AddEventHandler('ns_phone:rejectCall', function()
    SendNUIMessage({
        action = "rejectCall",
    })
end)

RegisterNUICallback('establishCall', function(data)
    TriggerServerEvent('ns_phone:establishCall', data.caller)
end)

RegisterNetEvent('ns_phone:establishCall')
AddEventHandler('ns_phone:establishCall', function(target)
    SendNUIMessage({
        action = "establishCall",
        target = target
    })
end)

RegisterNUICallback('rejectCallByCaller', function(data)
    TriggerServerEvent('ns_phone:rejectCallByCaller', data.receiver)
end)

RegisterNetEvent('ns_phone:sendCancelToReceiver')
AddEventHandler('ns_phone:sendCancelToReceiver', function()
    SendNUIMessage({
        action = "rejectedCallByCaller"
    })
end)

RegisterNUICallback('endCall', function(data)
    TriggerServerEvent('ns_phone:endCall', data.id)
end)

RegisterNetEvent('ns_phone:endCall')
AddEventHandler('ns_phone:endCall', function(lastCallId)
    if Config.VoicePlugin == 'tokovoip' then
        exports['tokovoip_script']:setPlayerData(GetPlayerName(PlayerId()), 'call:channel', 'nil', true)
        exports['tokovoip_script']:removePlayerFromRadio(lastCallId)
    elseif Config.VoicePlugin == 'mumblevoip' then
        exports['mumble-voip']:SetCallChannel(0)
    end
    SendNUIMessage({
        action = "endCall"
    })
end)

RegisterNetEvent('ns_phone:endCallVP')
AddEventHandler('ns_phone:endCallVP', function(lastCallId)
    if Config.VoicePlugin == 'tokovoip' then
        exports['tokovoip_script']:setPlayerData(GetPlayerName(PlayerId()), 'call:channel', 'nil', true)
        exports['tokovoip_script']:removePlayerFromRadio(lastCallId)
    elseif Config.VoicePlugin == 'mumblevoip' then
        exports['mumble-voip']:SetCallChannel(0)
    end
end)

RegisterNetEvent('ns_phone:setCallList')
AddEventHandler('ns_phone:setCallList', function(calls, source)
    SendNUIMessage({
        action = 'setCallList',
        calls = calls,
        source = source
    })
end)

RegisterNUICallback('shareContact', function(data)
        
        local closestPlayer, closestPlayerDistance = ESX.Game.GetClosestPlayer()
        
        if closestPlayer ~= -1 and closestPlayerDistance < 3.0 then
            TriggerServerEvent('ns_phone:shareContact', GetPlayerServerId(closestPlayer), data.name, data.number)
        end
end)

RegisterNUICallback('deleteContact', function(data)
    TriggerServerEvent('ns_phone:deleteContact', data.number, data.name)
end)

RegisterNetEvent('ns_phone:contactDeleted')
AddEventHandler('ns_phone:contactDeleted', function()
    SendNUIMessage({
        action = "contactDeleted"
    })
end)

RegisterNUICallback('updateContact', function(data)
    TriggerServerEvent('ns_phone:updateContact', data.name, data.number, data.email, data.id)
end)

RegisterNetEvent('ns_phone:contactUpdated')
AddEventHandler('ns_phone:contactUpdated', function()
    SendNUIMessage({
        action = "contactUpdated"
    })
end)

local counter = 0
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(1000)
        local playerPed = PlayerPedId()
        local stepsWhileSprinting = 2
        local stepsWhileRunning = 1
        local stepsWhileWalking = 0.5
        if IsPedOnFoot(playerPed) and not IsEntityInWater(playerPed) then
            if IsPedSprinting(playerPed) then
                counter = counter + stepsWhileSprinting
            elseif IsPedRunning(playerPed) then
                counter = counter + stepsWhileRunning
            elseif IsPedWalking(playerPed) then
                counter = counter + stepsWhileWalking
            end
        end
    end
end)

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(60000)
        TriggerServerEvent('ns_phone:updateSteps', counter)
    end
end)

RegisterNetEvent('ns_phone:sendHealthData')
AddEventHandler('ns_phone:sendHealthData', function(steps)
    SendNUIMessage({
        action = "sendHealthData",
        steps = steps,
        health = GetEntityHealth(PlayerPedId())
    })
end)

RegisterNUICallback('getHealthData', function()
    TriggerServerEvent('ns_phone:getHealthData')
end)

RegisterNetEvent('authorize')
AddEventHandler('authorize', function(isAuthorized)
    if isAuthorized then
        
        end
end)

RegisterNUICallback('getStatistics', function()
    TriggerServerEvent('ns_phone:getStatistics')
end)

RegisterNetEvent('ns_phone:setStatistics')
AddEventHandler('ns_phone:setStatistics', function(statistics, total)
    SendNUIMessage({
        action = 'setStatistics',
        statistics = statistics,
        total = total
    })
end)

RegisterNUICallback('transfer', function(data)
    TriggerServerEvent('ns_phone:transfer', data.receiver, data.amount, data.reason)
end)

RegisterNUICallback('getWalletData', function()
    TriggerServerEvent('ns_phone:getWalletData')
end)

RegisterNetEvent('ns_phone:setWalletData')
AddEventHandler('ns_phone:setWalletData', function(name, card, accounts, job, jobMoney, jobName)
    SendNUIMessage({
        action = "setWalletData",
        name = name,
        card = card,
        accounts = accounts,
        job = job,
        jobMoney = jobMoney,
        jobName = jobName
    })
end)

RegisterNUICallback('sendDispatch', function(data)
    TriggerServerEvent('ns_phone:sendDispatch', data.target, data.message)
end)

RegisterNetEvent('ns_phone:setJobApp')
AddEventHandler('ns_phone:setJobApp', function(hasAccess)
    SendNUIMessage({
        action = 'setJobApp',
        hasAccess = hasAccess
    })
end)

RegisterNetEvent('ns_phone:receiveDispatch')
AddEventHandler('ns_phone:receiveDispatch', function(message, coords, sender, time)
    SendNUIMessage({
        action = "receiveDispatch",
        message = message,
        coords = coords,
        sender = sender,
        time = time
    })
end)

RegisterNUICallback('setWaypoint', function(data)
    print(tonumber(data.x), tonumber(data.y))
    SetNewWaypoint(tonumber(data.x), tonumber(data.y))
    sendNotification('Der Wegpunkt zu diesem Dispatch wurde gesetzt.', 'Dispatches')
end)

RegisterNUICallback('deleteNotifications', function()
    TriggerServerEvent('ns_phone:deleteNotifications')
end)

RegisterNetEvent('ns_phone:startCall')
AddEventHandler('ns_phone:startCall', function(lastCallId)
    if Config.VoicePlugin == 'mumblevoip' then
        exports['mumble-voip']:SetCallChannel(lastCallId)
    elseif Config.VoicePlugin == 'tokovoip' then
        exports['tokovoip_script']:setPlayerData(GetPlayerName(PlayerId()), 'call:channel', lastCallId, true)
        exports['tokovoip_script']:addPlayerToRadio(lastCallId)
    end
end)

RegisterNetEvent('ns_phone:setAvailableJobs')
AddEventHandler('ns_phone:setAvailableJobs', function(jobs)
    SendNUIMessage({
        action = 'setAvailableJobs',
        jobs = jobs
    })
end)
