fx_version 'cerulean'
game 'gta5'

author 'nightstudios'
version '1.0'
description 'A unique phone made from scratch'

ui_page 'html/ui.html'

server_scripts {
    '@mysql-async/lib/MySQL.lua',
	'configs/config.lua',
    'server/main.lua',
}

client_scripts {
	'configs/config.lua',
    'client/main.lua',
	'client/animation.lua',
}

files {
    'configs/config.js',
    'html/ui.html',
    'html/css/style.css',
    'html/script.js',
    'html/images/phone.png',
    'html/images/galaxy.png',
    'html/images/default_bg.png',
    'html/fonts/SF-Pro-Rounded-Regular.otf',
    'html/fonts/SF-Pro-Rounded-Light.otf',
    'html/images/lockScreen.png',
    'html/images/*.png',
    'html/images/icons/*.png',
	'html/fonts/Nioicon.eot',
	'html/fonts/Nioicon.svg',
	'html/fonts/Nioicon.ttf',
	'html/fonts/Nioicon.woff',
    'html/audio/sound.ogg',
    'html/script.js',
    'html/css/themify-icons.css',
    'html/fonts/themify.eot',
    'html/fonts/themify.svg',
    'html/fonts/themify.ttf',
    'html/fonts/themify.woff',
    'html/audio/message_sent.ogg',
    'html/audio/notification.ogg',
    'html/css/icons.css',
    'html/audio/ringtone.ogg',
    'html/audio/call.ogg',
}