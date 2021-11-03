Config = {}

Config.ClientESXTrigger = 'esx:getSharedObject'
Config.ServerESXTrigger = 'esx:getSharedObject'

-- Available voice plugins: saltychat / tokovoip / mumblevoip
Config.VoicePlugin = 'saltychat' -- < PLEASE IN LOWERCASE

Config.Locale = 'en'

Config.TransactionId = 'tbx-46518421a13469-be401b'

Config.OpenKey = 288 -- Default: F1
-- Should the player carry an item to open their phone?
Config.NeedItem = true
-- Change this to the item name the user needs to have
Config.ItemName = "phone"

Config.Translations = {
    ['de'] = {
        ['needed_phone'] = 'Du benötigst ein Telefon um dieses zu nutzen.',
        ['set_waypoint'] = 'Der Wegpunkt zu diesem Dispatch wurde gesetzt.',
        ['set_waypoint_app'] = 'Dispatches',
        ['changed_flymode'] = 'Der Flugmodus wurde umgeschaltet.',
        ['changed_flymode_app'] = 'Einstellungen',
        ['sounds_on'] = 'Die Sounds wurden eingeschaltet',
        ['sounds_off'] = 'Die Sounds wurden ausgeschaltet.',
        ['sounds_app'] = 'Einstellungen',
        ['contact_created'] = 'Der Kontakt wurde erstellt.',
        ['contact_app'] = 'Kontakte',
        ['contact_as_favourite'] = 'Der Kontakt wurde als Favorit gesetzt.',
        ['contact_as_favourite_removed'] = 'Der Kontakt wurde als Favorit enfernt.',
        ['favourite_app'] = 'Kontakte',
        ['new_message'] = 'Du hast eine neue Nachricht erhalten.',
        ['new_message_app'] = 'Nachrichten',
        ['new_chat_err'] = 'Bitte gebe einen Empfänger und eine Nachricht ein!',
        ['new_chat_err_app'] = 'Nachrichten',
        ['note_saved'] = 'Deine Notiz wurde erfolgreich gespeichert.',
        ['note_saved_app'] = 'Notizen',
        ['note_updated'] = 'Deine Notiz wurde erfolgreich aktualisiert.',
        ['note_err'] = 'Diese Notiz scheint dir nicht zu gehören oder existiert nicht mehr.',
        ['note_deleted'] = 'Deine Notiz wurde gelöscht.',
        ['missed_call'] = 'Du hast einen Anruf verpasst.',
        ['call_app'] = 'Anrufe',
        ['contact_shared_sender'] = 'Du hast deinen Kontakt erfolgreich geteilt.',
        ['contact_shared_receiver'] = 'Mit dir wurde soeben ein Kontakt geteilt.',
        ['contact_share_err'] = 'Diese Person hat bereits eine Person mit dieser Nummer in Ihrem Kontaktbuch',
        ['contact_deleted'] = 'Du hast deinen Kontakt gelöscht',
        ['contact_delete_err'] = 'Dieser Kontakt ist nicht in deinem Kontaktbuch hinterlegt.',
        ['contact_updated'] = 'Dein Kontakt wurde erfolgreich aktualisiert.',
        ['steps_updated'] = 'Du bist gestern %s Schritte gelaufen.',
        ['health_app'] = 'Health',
		['emergency_call'] = 'Ein neuer Notruf ist eingegangen',
		['emergency_call_sent'] = 'Dein Notruf wurde erfolgreich abgeschickt.',
        ['emergency_app'] = 'Notrufe',
        ['emergency_job_cant_be_reached'] = 'Diesem Job kannst du keinen Notruf senden.',
        -- You can ignore these translations they are for the banking app which is not included
        ['transfer_to_society'] = 'Du hast %s an %s gesendet.',
        ['banking_app'] = 'Banking',
        ['transfer_user_sender'] = 'Du hast %s an %s gesendet.',
        ['transfer_user_receiver'] = 'Du hast %s von %s erhalten.',
        ['transfer_to_self'] = 'Du kannst dir selbst kein Geld überweisen.',
        ['cardnumber_does_not_exist'] = 'Diese Kartennummer existiert nicht.',
        ['not_enough_money'] = 'Du hast nicht genügend Geld auf deiner Bank, um diesen Betrag zu überweisen.',

    },
    ['en'] = {
        ['needed_phone'] = 'You need a phone to use it.',
        ['set_waypoint'] = 'The waypoint to this dispatch has been set.',
        ['set_waypoint_app'] = 'Dispatches',
        ['changed_flymode'] = 'The flight mode has been switched.',
        ['changed_flymode_app'] = 'Settings',
        ['sounds_on'] = 'The sounds have been switched on',
        ['sounds_off'] = 'The sounds have been switched off',
        ['sounds_app'] = 'settings',
        ['contact_created'] = 'The contact has been created.',
        ['contact_app'] = 'Contacts',
        ['contact_as_favourite'] = 'The contact has been set as a favorite.',
        ['contact_as_favourite_removed'] = 'The contact has been removed as a favorite.',
        ['favourite_app'] = 'Contacts',
        ['new_message'] = 'You have received a new message.',
        ['new_message_app'] = 'Messages',
        ['new_chat_err'] = 'Please enter a recipient and a message!',
        ['new_chat_err_app'] = 'Messages',
        ['note_saved'] = 'Your note has been successfully saved.',
        ['note_saved_app'] = 'Notes',
        ['note_updated'] = 'Your note was successfully updated.',
        ['note_err'] = 'This note does not appear to belong to you or no longer exists.',
        ['note_deleted'] = 'Your note has been deleted.',
        ['missed_call'] = 'You have missed a call.',
        ['call_app'] = 'Calls',
        ['contact_shared_sender'] = 'You have successfully shared your contact.',
        ['contact_shared_receiver'] = 'A contact has just been shared with you.',
        ['contact_share_err'] = 'This person already has a person with this number in your contact book',
        ['contact_deleted'] = 'You have deleted your contact',
        ['contact_delete_err'] = 'This contact is not stored in your contact book.',
        ['contact_updated'] = 'Your contact has been updated successfully.',
        ['steps_updated'] = 'You walked %s steps yesterday.',
        ['health_app'] = 'Health',
		['emergency_call'] = 'A new emergency call has been received',
		['emergency_call_sent'] = 'Your emergency call was sent.',
        ['emergency_app'] = 'Emergency calls',
        ['emergency_job_cant_be_reached'] = 'You can\'t send this job an emergency call.',
        -- You can ignore these translations they are for the banking app which is not included
        ['transfer_to_society'] = 'You have sent %s to %s.',
        ['banking_app'] = 'Banking',
        ['transfer_user_sender'] = 'You have sent %s to %s.',
        ['transfer_user_receiver'] = 'You received %s from %s.',
        ['transfer_to_self'] = 'You can\'t transfer money to yourself.',
        ['cardnumber_does_not_exist'] = 'This card number does not exist.',
        ['not_enough_money'] = 'You don\'t have enough money in your bank to transfer this amount.',
    }
}