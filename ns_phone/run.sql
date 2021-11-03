ALTER TABLE users ADD phone_number VARCHAR(50) NOT NULL;
ALTER TABLE jobs ADD hasapp TINYINT(1) NULL;
ALTER TABLE users ADD steps INT(11) DEFAULT 0;

CREATE TABLE IF NOT EXISTS `ns_phone_calls` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `caller` varchar(50) NOT NULL,
  `receiver` varchar(50) NOT NULL,
  `time` datetime NOT NULL DEFAULT current_timestamp(),
  `accepted` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `ns_phone_chat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender` varchar(50) NOT NULL,
  `receiver` varchar(50) NOT NULL,
  `time` datetime NOT NULL DEFAULT current_timestamp(),
  `isSenderRead` tinyint(1) NOT NULL DEFAULT 0,
  `isReceiverRead` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `ns_phone_chat_messages` (
  `chat_id` int(11) NOT NULL,
  `sender` varchar(50) NOT NULL,
  `receiver` varchar(50) NOT NULL,
  `message` longtext NOT NULL,
  `time` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `ns_phone_contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `identifier` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `profile_picture` longtext DEFAULT NULL,
  `number` varchar(50) NOT NULL,
  `favourite` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `ns_phone_health` (
  `identifier` varchar(50) NOT NULL,
  `steps` int(11) NOT NULL DEFAULT 0,
  `time` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `ns_phone_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone_number` varchar(50) NOT NULL,
  `title` longtext NOT NULL,
  `text` longtext NOT NULL,
  `time` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `ns_phone_notifications` (
  `phonenumber` varchar(100) NOT NULL,
  `app` varchar(50) NOT NULL,
  `text` text NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT current_timestamp(),
  `read` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `ns_phone_settings` (
  `phonenumber` varchar(50) NOT NULL,
  `background` longtext NOT NULL DEFAULT 'https://i.ibb.co/DGjJqmv/default-bg.png',
  `lockscreen` longtext NOT NULL DEFAULT 'https://i.ibb.co/DGjJqmv/default-bg.png',
  `flymode` tinyint(1) NOT NULL DEFAULT 0,
  `battery` int(10) NOT NULL DEFAULT 0,
  `sounds` int(10) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

