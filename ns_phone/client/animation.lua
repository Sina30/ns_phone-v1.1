        function Animation()
            Citizen.CreateThread(function()
                RequestAnimDict('cellphone@')
                while not HasAnimDictLoaded("cellphone@") do
                    Citizen.Wait(0)
                end
                tab = CreateObject(GetHashKey("prop_npc_phone_02"), 1.0, 1.0, 1.0, 1, 1, 0)
                AttachEntityToEntity(tab, GetPlayerPed(-1), GetPedBoneIndex(GetPlayerPed(-1), 28422), 0.0, 0.0, 0.0, 0.0, 0.0,
                    0.0, 1, 1, 0, 0, 2, 1)
                -- TaskPlayAnim(GetPlayerPed(-1), "cellphone@", "cellphone_text_in", 8.0, -8.0, -1, 50, 0, false, false, false)
                -- StopAnimTask(GetPlayerPed(-1), "cellphone@", "cellphone_text_in", 1.0)
                TaskPlayAnim(GetPlayerPed(-1), "cellphone@", "cellphone_text_in", 8.0, -8.0, -1, 50, 0, false, false, false)
            end)
        end
        
        function stopAnimation()
            TaskPlayAnim(GetPlayerPed(-1), "cellphone@", "cellphone_text_out", 8.0, -8.0, -1, 50, 0, false, false, false)
            Citizen.Wait(500)
            DeleteEntity(tab)
            StopAnimTask(GetPlayerPed(-1), "cellphone@", "cellphone_text_out", 1.0)
        end