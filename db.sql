CREATE DATABASE  IF NOT EXISTS `proposif` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `proposif`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: proposif
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `functions`
--

DROP TABLE IF EXISTS `functions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `functions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `functions`
--

LOCK TABLES `functions` WRITE;
/*!40000 ALTER TABLE `functions` DISABLE KEYS */;
INSERT INTO `functions` VALUES (25,'Coordinatrice Back office'),(26,'Formateur'),(27,'RSRC'),(28,'RSSE'),(29,'Agent de maintenance'),(30,'DE'),(31,'Formateur SE'),(32,'Stagiaire qualité'),(33,'RsRC'),(34,'Coursier'),(35,'Magasinier'),(36,'Coordinatrice Back office'),(37,'Formateur Usinage'),(38,'RDP'),(39,'Formateur AJ'),(40,'Agent Maintenance'),(41,'Formateur composite');
/*!40000 ALTER TABLE `functions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `proposition_id` int NOT NULL,
  `type` enum('before','after') NOT NULL,
  `filename` varchar(255) NOT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `original_name` varchar(255) DEFAULT NULL,
  `file_size` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `proposition_id` (`proposition_id`),
  CONSTRAINT `images_ibfk_1` FOREIGN KEY (`proposition_id`) REFERENCES `propositions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1037 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proposition_status`
--

DROP TABLE IF EXISTS `proposition_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proposition_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `proposition_id` int NOT NULL,
  `voting_session_id` int NOT NULL,
  `is_validated` tinyint DEFAULT NULL,
  `is_voted` tinyint DEFAULT '0',
  `voting_completed` tinyint DEFAULT '0',
  `average_grade` float DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `proposition_id` (`proposition_id`),
  KEY `voting_session_id` (`voting_session_id`),
  CONSTRAINT `proposition_status_ibfk_1` FOREIGN KEY (`proposition_id`) REFERENCES `propositions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `proposition_status_ibfk_2` FOREIGN KEY (`voting_session_id`) REFERENCES `voting_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2576 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proposition_status`
--

LOCK TABLES `proposition_status` WRITE;
/*!40000 ALTER TABLE `proposition_status` DISABLE KEYS */;
INSERT INTO `proposition_status` VALUES (2511,1529,141,NULL,1,1,4,'2024-10-15 12:36:15','2024-10-15 20:49:56'),(2512,1531,141,NULL,1,1,6,'2024-10-15 12:36:15','2024-10-15 20:50:13'),(2513,1532,141,NULL,1,1,0,'2024-10-15 12:36:15','2024-10-15 20:50:37'),(2514,1533,141,NULL,1,1,0,'2024-10-15 12:36:15','2024-10-15 20:50:41'),(2515,1534,141,NULL,1,1,0,'2024-10-15 12:36:15','2024-10-15 20:50:46'),(2516,1535,141,NULL,1,1,0,'2024-10-15 12:36:15','2024-10-15 20:50:50'),(2517,1536,141,NULL,1,1,0,'2024-10-15 12:36:15','2024-10-15 20:50:55'),(2518,1537,141,NULL,1,1,0,'2024-10-15 12:36:15','2024-10-15 20:50:59'),(2519,1538,141,NULL,1,1,0,'2024-10-15 12:36:15','2024-10-15 20:51:04'),(2520,1539,141,NULL,1,1,0,'2024-10-15 12:36:15','2024-10-15 20:51:10'),(2521,1540,141,NULL,1,1,0,'2024-10-15 12:36:15','2024-10-15 20:51:15'),(2522,1542,141,NULL,1,1,0,'2024-10-15 12:36:15','2024-10-15 20:51:26'),(2523,1543,141,NULL,1,1,0,'2024-10-15 12:36:15','2024-10-15 20:51:30'),(2524,1544,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2525,1545,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2526,1546,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2527,1547,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2528,1548,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2529,1549,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2530,1550,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2531,1551,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2532,1552,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2533,1553,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2534,1554,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2535,1555,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2536,1556,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2537,1557,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2538,1558,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2539,1559,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2540,1560,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2541,1561,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2542,1562,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2543,1563,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2544,1564,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2545,1565,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2546,1566,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2547,1567,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2548,1568,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2549,1569,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2550,1570,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2551,1571,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2552,1572,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2553,1573,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2554,1574,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2555,1575,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2556,1576,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2557,1577,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2558,1578,141,NULL,0,0,0,'2024-10-15 12:36:15','2024-10-15 12:36:15'),(2559,1531,142,NULL,0,0,1.5,'2024-10-15 20:53:16','2024-10-15 20:55:22'),(2560,1532,142,NULL,0,0,2.5,'2024-10-15 20:53:16','2024-10-15 20:55:22'),(2561,1533,142,NULL,0,0,1,'2024-10-15 20:53:16','2024-10-15 20:55:22'),(2562,1537,142,NULL,0,0,3,'2024-10-15 20:53:16','2024-10-15 20:55:22'),(2563,1538,142,NULL,0,0,2,'2024-10-15 20:53:16','2024-10-15 20:55:22'),(2564,1539,142,NULL,0,0,0.5,'2024-10-15 20:53:16','2024-10-15 20:55:22'),(2565,1545,142,NULL,0,0,0,'2024-10-15 20:53:16','2024-10-15 20:55:22'),(2566,1552,142,NULL,0,0,0,'2024-10-15 20:53:16','2024-10-15 20:55:22'),(2567,1560,142,NULL,0,0,0,'2024-10-15 20:53:16','2024-10-15 20:55:22'),(2568,1563,142,NULL,0,0,0,'2024-10-15 20:53:16','2024-10-15 20:55:22'),(2569,1564,142,NULL,0,0,0,'2024-10-15 20:53:16','2024-10-15 20:55:22'),(2570,1567,142,NULL,0,0,0,'2024-10-15 20:53:16','2024-10-15 20:55:22'),(2571,1568,142,NULL,0,0,0,'2024-10-15 20:53:16','2024-10-15 20:55:22'),(2572,1573,142,NULL,0,0,0,'2024-10-15 20:53:16','2024-10-15 20:55:22'),(2573,1575,142,NULL,0,0,0,'2024-10-15 20:53:16','2024-10-15 20:55:22'),(2574,1577,142,NULL,0,0,0,'2024-10-15 20:53:16','2024-10-15 20:55:22'),(2575,1578,142,NULL,0,0,0,'2024-10-15 20:53:16','2024-10-15 20:55:22');
/*!40000 ALTER TABLE `proposition_status` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_proposition_status_update` AFTER UPDATE ON `proposition_status` FOR EACH ROW BEGIN
      DECLARE total_propositions INT;
      DECLARE completed_propositions INT;

      SELECT COUNT(*) INTO total_propositions
      FROM proposition_status
      WHERE voting_session_id = NEW.voting_session_id;

      SELECT COUNT(*) INTO completed_propositions
      FROM proposition_status
      WHERE voting_session_id = NEW.voting_session_id AND is_voted = 1 AND voting_completed = 1;
  
      IF total_propositions > 0 AND total_propositions = completed_propositions THEN
          UPDATE voting_sessions
          SET ended = 1, end_time = NOW(), is_active = 0
          WHERE id = NEW.voting_session_id and type = 'jury';
      END IF;

      UPDATE propositions
      SET retenu = 1
      WHERE id IN (
          SELECT proposition_id
          FROM proposition_status
          WHERE is_voted = 1
          GROUP BY proposition_id
          HAVING AVG(average_grade) >= 3
      );
  END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `propositions`
--

DROP TABLE IF EXISTS `propositions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `propositions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date_emission` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `description_situation_actuelle` text NOT NULL,
  `description_amelioration_proposee` text NOT NULL,
  `retenu` tinyint(1) DEFAULT NULL,
  `cout_reel` int DEFAULT NULL,
  `date_realisation` date DEFAULT NULL,
  `objet` varchar(255) DEFAULT NULL,
  `impact_economique` tinyint(1) DEFAULT '0',
  `impact_technique` tinyint(1) DEFAULT '0',
  `impact_formation` tinyint(1) DEFAULT '0',
  `impact_fonctionnement` tinyint(1) DEFAULT '0',
  `statut` enum('non soldee','en cours','soldee','annulee') DEFAULT 'non soldee',
  `locked` tinyint(1) DEFAULT '0',
  `is_excluded` tinyint DEFAULT '0',
  `Critère_de_sélection` varchar(255) DEFAULT NULL,
  `Délai_initial` varchar(255) DEFAULT NULL,
  `nouveau_délai` varchar(255) DEFAULT NULL,
  `Sponsor` varchar(255) DEFAULT NULL,
  `Date_de_réalisation` date DEFAULT NULL,
  `Remarque` text,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `propositions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1579 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `propositions`
--

LOCK TABLES `propositions` WRITE;
/*!40000 ALTER TABLE `propositions` DISABLE KEYS */;
INSERT INTO `propositions` VALUES (1529,'2024-01-29 01:00:00',37,'Problème digestif et gonflement','L\'ajout des boissons spécifique dans le distributeur conçu pour soulager les gonflements et les problèmes digestifs.',1,NULL,NULL,NULL,0,0,0,0,'non soldee',1,0,'P',NULL,NULL,NULL,NULL,NULL),(1530,'2024-01-29 01:00:00',38,'4 Cé fixe Hors-service','Étude et réalisation de 4 supports \"portent Bouterolles\" adaptables',1,NULL,NULL,NULL,0,0,0,0,'annulee',0,0,'P2',NULL,NULL,NULL,NULL,NULL),(1531,'2024-01-29 01:00:00',38,'Chasses goupilles grand diamètre non exploitable','Usinage  des chasses goupilles  grand diamètre non utiliser à des petits diamètres utiliser',1,NULL,NULL,NULL,0,0,0,0,'soldee',1,0,'P1','2024-01-30 01:00:00.000',NULL,'RDP',NULL,NULL),(1532,'2024-01-29 01:00:00',40,'Proposition ','À la fin de formation prendre une photo du groupe et faire un cadre AS puis l\'afficher en salle Atrium pour motiver les candidats qui viennent au concours',1,NULL,NULL,NULL,0,0,0,0,'soldee',1,0,'P1','2024-01-30 01:00:00.000',NULL,'RSRC',NULL,NULL),(1533,'2024-01-29 01:00:00',40,'Proposition ','Créer une base de donnés anciens stagiaires IMA, on peut commencer par les stagiaires qui terminent la formation le dernier jour on peut distribuer une fiche pour avoir les informations.',1,NULL,NULL,NULL,0,0,0,0,'soldee',1,0,'P1','2024-01-30 01:00:00.000',NULL,'RSRC',NULL,NULL),(1534,'2024-01-29 01:00:00',40,'Proposition ','Coller un identifiant d\'accueil pour bien identifier la salle d\'accueil pour les visiteurs',1,NULL,NULL,NULL,0,0,0,0,'en cours',1,0,NULL,NULL,NULL,NULL,NULL,'Standard  pour les bureaux '),(1535,'2024-01-29 01:00:00',40,'Proposition ','Journée porte ouverte pour promouvoir l\'image de l\'IMA et attirer plus de gens vers L\'IMA',1,NULL,NULL,NULL,0,0,0,0,'en cours',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1536,'2024-01-29 01:00:00',41,'Manque de l\'appréciation du respect du FOD sur la fiche FR-08-SV30-03','Ajouter dans la grille qualité SSE de la fiche FR-08-SV30-03, une appréciation FOD pour sensibiliser les stagiaires sur l\'importance de l\'action et son impact sur la sécurité du travail.',1,NULL,NULL,NULL,0,0,0,0,'en cours',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1537,'2024-01-29 01:00:00',41,'L\'appréciation comportementale stagiaire existante ne révèle pas tout le savoir-faire et savoir-être du stagiaire.','Pour améliorer les appréciations des stagiaires par les formateurs, une grille a été créer pour mieux valoriser les compétences soit techniques soit soft skills, bien sûr l\'idée c\'est d\'inspirer sur les bonnes pratiques, à savoir, le contenu est modifiable. ',1,NULL,NULL,NULL,0,0,0,0,'soldee',1,0,'P1','2024-01-30 01:00:00.000',NULL,'RE',NULL,NULL),(1538,'2024-01-29 01:00:00',37,'Journée de la femme','Envisager un geste  significatif envers l\'effectif féminin, cela favorise le développement professionnel des femmes au sein de l\'IMA et renforcer leur impact positif dans l\'environnement de travail.',1,NULL,NULL,NULL,0,0,0,0,'soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1539,'2024-01-29 01:00:00',43,'Besoin d\'eau pour les femmes de ménage  zone cafetière','Réalisation d\'un robinet prés de cafetière pour alimenter les femmes de ménage avec de l\'eau pour le nettoyage',1,NULL,NULL,NULL,0,0,0,0,'soldee',1,0,'P1','2024-01-30 01:00:00.000',NULL,'REX',NULL,NULL),(1540,'2024-02-29 01:00:00',45,'Manque d\'une visibilité claire sur la situation des stagiaires en entreprise durant l\'alternance ; -Absence en temps réel - échange instantané avec les tuteurs en entreprise - droit d\'accès aux données des stagiaires / onglets de prospection','Une application sur Android facile à manipuler, avec possibilité d\'échange d\'info en temps réel avec des onglets de prospection pour l\'institut (catalogue de formation, planning formation continue)',0,NULL,NULL,NULL,0,0,0,0,'non soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1542,'2024-02-29 01:00:00',37,'Proposition ','Réaliser des publications \"flyer ou des affiches pour les formations et prestation IMA à l\'accueil pour donner plus de visibilité pour les invités',1,NULL,NULL,NULL,0,0,0,0,'en cours',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1543,'2024-02-29 01:00:00',41,'Suite à la constatation des débris dans les couloirs des ateliers (vis, rivets, coupeaux, …) qui constituent un FOD, ce dernier entraine des raves problèmes pour l\'aéronautique et qui exige une priorité de traitement immédiate','1. Aménager un caisson indiqué FOD pour les couloirs.   2. Des bacs gravés FOD pour les postes de travail, adaptés pour chaque filière.                                                                                                                        ',1,NULL,NULL,NULL,0,0,0,0,'en cours',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1544,'2024-02-29 01:00:00',41,'Perte du temps dans la saisie des informations IP','Travailler sur un outil de digitalisation de l\'information qui pourra aider par la suite dans la diversité de la communication, commençant déjà par les idées participatives.',1,NULL,NULL,NULL,0,0,0,0,'en cours',1,0,'P1',NULL,NULL,NULL,NULL,NULL),(1545,'2024-02-29 01:00:00',48,'Manque de fiche pour formaliser les incidents ','Mise en place d\'une fiche de signalement d\'un incident',1,NULL,NULL,NULL,0,0,0,0,'soldee',1,0,'P1','2024-04-25 01:00:00.000',NULL,'RQ',NULL,NULL),(1546,'2024-02-29 01:00:00',41,'Chaque débris dans les couloirs industriels comme les têtes de vis ou autres peut entrainer des dommages au niveau des systèmes fabriqués, exemple : moteur d\'avion ou autres, pour cela l\'instauration de l\'idée FOD pour les stagiaires de  L\'IMA pourra les aider à améliorer leurs compétences sur la sécurité du travail.','On propose d\'aménager un caisson en cuir rouge avec une signalisation au-dessus pour indiquer aux stagiaires de l\'IMA là où ils peuvent déposer les débris trouvés dans les couloirs des ateliers de l\'IMA ou à l\'extérieur.',0,NULL,NULL,NULL,0,0,0,0,'non soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1547,'2024-02-29 01:00:00',37,'Soutien aux candidats potentiels en phase de recrutement ','Produire des vidéos et des témoignages des lauréats et des stagiaires IMA de leur expérience positive pour inspirer les candidats potentiels',1,NULL,NULL,NULL,0,0,0,0,'en cours',1,0,'P1',NULL,NULL,NULL,NULL,NULL),(1548,'2024-02-29 01:00:00',40,'Sociale ','Déjeuner ensemble vendredi soit à l\'IMA ou à l\'extérieur avec tous le personnel IMA . L\'objectif  et de faire une équipe solide',1,NULL,NULL,NULL,0,0,0,0,'en cours',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1549,'2024-02-29 01:00:00',40,'Projet association ','Faire s\'amener des association pour amener gratuitement des séance de sensibilisation sur différents thèmes: Cigarette / sida / Environnement /Santé',1,NULL,NULL,NULL,0,0,0,0,'non soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1550,'2024-02-29 01:00:00',40,'Proposition ','Créer un livre d\'or pour garder la trace des reçues et des évènement importants ',0,NULL,NULL,NULL,0,0,0,0,'non soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1551,'2024-02-29 01:00:00',49,'Mauvais éclairage dans le parking ','Investir dans des projecteurs solaire',1,NULL,NULL,NULL,0,0,0,0,'non soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1552,'2024-02-29 01:00:00',47,'Grille d\'auto positionnement + canevas de calcul pour l\'ingénierie de formation ( prestation à vendre aux entreprises)','Un model de fiche d\'évaluation des compétences avec un système de notations. Un canevas qui calcule automatiquement le résultat et reflète la position du salarié par rapport à la compétence diagnostique',1,NULL,NULL,NULL,0,0,0,0,'soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1553,'2024-03-29 01:00:00',50,'Non respect des stagiaires de l\'accès cantine ','Affichage de l\'interdiction d\'entrée des trois porte cantine, question de respect de self plus organisation ',1,NULL,NULL,NULL,0,0,0,0,'non soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1554,'2024-03-29 01:00:00',50,'Le fait que le tableau de formation ne soit pas effacé à la fin de la séance entraîne des problèmes avec la trace de marqueur qui se colle au tableau.','Coller une note dans chaque salle \"Merci d\'effacer le tableau a la fin de la séance\".',0,NULL,NULL,NULL,0,0,0,0,'non soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1555,'2024-03-29 01:00:00',50,'L\'ouverture et la fermeture des rideaux électrique ateliers par tout le monde peut créer des problèmes au niveaux fonctionnement normale','Mettre en place une boitier à clé pour l\'ouverture et la fermeture ',0,NULL,NULL,NULL,0,0,0,0,'non soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1556,'2024-03-29 01:00:00',50,'Risque de détérioration de la tuyauterie à gaz coté cantine ','Fabrication d\'un support pour protéger la tuyauterie des intempéries',1,NULL,NULL,NULL,0,0,0,0,'non soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1557,'2024-03-29 01:00:00',50,'Gonflement de terre près d\'égouts de la salle spirite : Risque à vérifier','Voir Photo',0,NULL,NULL,NULL,0,0,0,0,'non soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1558,'2024-03-29 01:00:00',50,'Manque de la fontaine d\'eau dans la zone usinage. Déplacement des stagiaires pour remplir les bouteille d\'eau plusieurs fois dans la séance pratique.','Equiper la zone usinage par une fontaine d\'eau',1,NULL,NULL,NULL,0,0,0,0,'non soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1559,'2024-03-29 01:00:00',50,'L\'affichage d\'heure d\'entrée à la cantine n\'est pas mise a jour. ','Mise à jour hebdomadaire pour une gestion efficace des selfs cantine.',0,NULL,NULL,NULL,0,0,0,0,'non soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1560,'2024-03-29 01:00:00',50,'Modification bon de sortie matière ','Modification & mise a jour sur le SMQ',1,NULL,NULL,NULL,0,0,0,0,'soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1561,'2024-03-29 01:00:00',43,'Zone stockage Huile & PR mal organisé','Organisation et étiquetage zone lubrifiant / huile /PR',1,NULL,NULL,NULL,0,0,0,0,'non soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1562,'2024-03-29 01:00:00',43,'Stockage des profilées d\'aluminium forme carrée et rond a l\'extérieur des magasin ','Pour maitriser la gestion de stocke des profiles il faut les stock dans le magasin => Fabrication d\'un support pour stockage des profilé à l\'intérieur des magasin',1,NULL,NULL,NULL,0,0,0,0,'non soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1563,'2024-03-29 01:00:00',43,'La lame de scie est brisée à chaque fois que les stagiaires l\'utilisent.','L\'idée est de remplacer la lame 6 mm par une lame de 10 mm d\'épaisseur.',1,NULL,NULL,NULL,0,0,0,0,'soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1564,'2024-03-29 01:00:00',43,'Rolls up IMA Hors service ','Récupération de Rolls up par installation d\'un ressort et vis',1,NULL,NULL,NULL,0,0,0,0,'soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1565,'2024-03-29 01:00:00',50,'Manque d\'un organiseur fixation pour les stagiaires pour éviter les pertes','Achats d\'un organiseur bi couleur MANO 134*101*31MM pou ranger les fixation ',1,NULL,NULL,NULL,0,0,0,0,'non soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1566,'2024-03-29 01:00:00',37,'Renforcer Notre Image de marque ','Envisager des couverture publicitaire sur nos voiture de service par le signalétique de notre institut ',1,NULL,NULL,NULL,0,0,0,0,'non soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1567,'2024-03-29 01:00:00',51,' 4 Cé fixe de rivetage ne sont pas fonctionnels à cause de la grande distance entre la partie mobile et la partie fixe ','Réaliser 4 pièces en acier pour diminuer la distance entre la partie fixe et la partie mobile. ',1,NULL,NULL,NULL,0,0,0,0,'soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1568,'2024-03-29 01:00:00',38,'Les outils pneumatique pas bien stocke ( mélange entre les perceuse ; droite/ revolver / renvoi) et aussi les marteaux pneumatique. ','A fin de faciliter le rangement de ces outils et de les protéger contre les chocs, en à fabrique des supports de fixations. ',1,NULL,NULL,NULL,0,0,0,0,'soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1569,'2024-03-29 01:00:00',52,'Difficulté d\'identifier L\'IMA vu de tous les angles','Mise en place d\'un panneau publicitaire porte le nom de l\'institut au façade avant coté route.',1,NULL,NULL,NULL,0,0,0,0,'non soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1570,'2024-03-29 01:00:00',52,'Risque d\'évacuation vers le point de rassemblement si la grande porte condamné ou en panne','Proposition de mise en place une porte issue de secours juste à coté de la grande porte (zone atelier usinage)',1,NULL,NULL,NULL,0,0,0,0,'non soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1571,'2024-03-29 01:00:00',43,'Absence d\'un Gillet pour équiper les prestataires qui son la à IMA pour des prestation maintenance.','Gillet pour les prestataires ',1,NULL,NULL,NULL,0,0,0,0,'non soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1572,'2024-03-29 01:00:00',44,'Deux pince rivets Filière Ajustage Hors service','Récupération de deux Pince coupe Rivets',0,NULL,NULL,NULL,0,0,0,0,'non soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1573,'2024-03-29 01:00:00',47,'Une difficulté dans la gestion des visiteurs de L\'IMA, est soulevée par différents serviles à cause des tâches ou action qui ne sont pas respectées.','Etablir une fiche en français et en arabe qui décrit d\'une maniéré simple l\'ensemble des étapes à suivre pour gérer un visiteur des son entrée jusqu’à sa sortie. ',1,NULL,NULL,NULL,0,0,0,0,'soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1574,'2024-03-29 01:00:00',47,'Les attestations et les certificats de la fin formation ne contiennent pas ni numéro de série ni plan de formation ','Etablir un code (numéro de série) unique alloué à chaque attestation / certificat pour verrouillage, aussi imprimer sur son dos le plan de formation pour faire le lien entre le titre de la formation et les compétence acquises. ',1,NULL,NULL,NULL,0,0,0,0,'non soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1575,'2024-03-29 01:00:00',53,'J\'écoute et j\'oublie, Je vois et je me souviens, Je fais et je retiens','Affichage des images outillages + structure avion en français et anglais a l\'atelier ajustage (Voir Photo)',1,NULL,NULL,NULL,0,0,0,0,'soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1576,'2024-04-29 01:00:00',44,'Perceuse à colonne hors service ','Récupération de la perceuse par fabrication d\'une pièces en interne (usinage conventionnel) et récupérer d\'autre pièces d\'une ancien perceuse HS',1,NULL,NULL,NULL,0,0,0,0,'non soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1577,'2024-04-29 01:00:00',41,'Besoin d\'formation générale sur la matière pour les différends modules de IMA','Organiser une bibliothèque sur le réseau IMA avec une variété des documents techniques comme matière et source d\'information pour les formateur afin de les aider dans la conception des modules ou les QCM.',1,NULL,NULL,NULL,0,0,0,0,'soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL),(1578,'2024-04-29 01:00:00',54,'Problèmes de détérioration du panneau causés par la corrosion.','Réparation locale en utilisant les ressources locales (absence d\'investissement).',1,NULL,NULL,NULL,0,0,0,0,'soldee',1,0,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `propositions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('B3ilFyL0rKc3uCgqNJwMpsFC67BiR27V',1729046510,'{\"cookie\":{\"originalMaxAge\":10800000,\"expires\":\"2024-10-15T23:42:48.212Z\",\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"userId\":1,\"isAdmin\":1,\"isJury\":1}'),('ZjW9PmbZxEEmvEffA19U8GXk50Nb2Tj3',1729049683,'{\"cookie\":{\"originalMaxAge\":10800000,\"expires\":\"2024-10-16T02:43:58.338Z\",\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"userId\":1,\"isAdmin\":1,\"isJury\":1}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test` (
  `id` int NOT NULL AUTO_INCREMENT,
  `t` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
/*!40000 ALTER TABLE `test` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `function_id` int DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT '0',
  `is_jury` tinyint(1) DEFAULT '0',
  `is_user` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `fonction_id` (`function_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`function_id`) REFERENCES `functions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2b$10$4/yMM/x2vtE7hS3PNQCd4euiiqi5AA.f1lgAEaYpFvVMaC05SJ0fG','admin','admin',30,1,1,NULL),(35,'jury','$2b$10$41G4O17OtARXx/TccUR/D.PV5mMN1qHjL3brDCWqpQRaQdAKIIou2','jury','jury',30,0,1,NULL),(36,'user','$2b$10$auhCWFUc5rEyYlHwI1/LxeB2cC0F1DcSfriIVuQbQENoFljU4aQuO','user','user',30,0,0,NULL),(37,'Oussous','$2b$10$XAdalQ5GAAuI4MxveVje4O05rA1xxAY96e/gADt.XzudJNZXm6K0C','Oussous',NULL,25,0,0,NULL),(38,'Azeddine','$2b$10$e27NFPAd5Ywp7FM8BWiBwOjJUeCVUwoSrF0oluI1i8sEDH17cezAa','Azeddine',NULL,26,0,0,NULL),(39,'Hassan','$2b$10$Kpr.M19M4UnJPxC8U6jTiukaAhVKbMaQJdQtIFVecTcx/UY8WWFsO','Hassan',NULL,26,0,0,NULL),(40,'Aicha','$2b$10$2jxuaWa39riOi2Kk3IKGJOvA.hGwCaI5UUuy7lgv.Jb6nlEsyKegq','Aicha',NULL,27,0,0,NULL),(41,'Rkha','$2b$10$d28TIahXVwq6YSGI9Ekm0eLS04jFe.GrSAP1UZfij9kwM8XrdlGmy','Rkha',NULL,26,0,0,NULL),(42,'Rafia','$2b$10$IxkTcaeUZOJj8q0arwU.LeKhHQNuijZ.oU4ZWK6bH/14WrcJCiwYG','Rafia',NULL,26,0,0,NULL),(43,'Aziz','$2b$10$YvcfDEzpfVBSAVHhxpMzbu1p9Qw90tles4iIwnz.3emYieXeiS0y6','Aziz',NULL,29,0,0,NULL),(44,'Abderahim','$2b$10$zF2I6O2zqxXxCEXMhR0oLu3G4.oRctgNfBFcH5ZwsszKPTRAkxti6','Abderahim',NULL,29,0,0,NULL),(45,'Ramzi','$2b$10$FECrUGJMn6zVgFHXPWrz2eASucAjq74D/HxiJMYK8XMXk8UcIQiou','Ramzi',NULL,30,0,0,NULL),(46,'Oussama','$2b$10$3APtYk2WqJmCXnnBa02RYu56h11acKRSPdPUQbOUiKQu0zNoRsBk6','Oussama','',26,0,0,NULL),(47,'Soufiane','$2b$10$wCz6/j511THImwTbHTu6F.w2oZ8ieY84416GgOIuWlXoLKluokUNC','Soufiane',NULL,30,0,0,NULL),(48,'stagiaire','$2b$10$BqVAzB/Pe0dHhRG5egBwcOUU5Tigpcsbos7XY2YxJYFkHFRa6t3LS','stagiaire',NULL,32,0,0,NULL),(49,'Er-radi','$2b$10$1wREUSyrFlh0Cvd7.VZF4u.PeDabMoQa0HflDNXJbrQoqDx.KtcYy','Er-radi',NULL,34,0,0,NULL),(50,'Zakaria','$2b$10$3sVlXZsq6HEqW8cWBiPhcuDF2VMBudzHZ2qsWY.5vGwGG59ZQwQQW','Zakaria',NULL,35,0,0,NULL),(51,'Qada','$2b$10$zxxX89MvdQ2gGFwifprJ2OAbvEag.FWO8/BuvZIP8v0IMtcc9RZUe','Qada',NULL,37,0,0,NULL),(52,'El idrissi','$2b$10$QRMKGW7nmEetLBepZspLHeLsCzB/OSrtoTquh/iavSjHZX7XewT4C','El idrissi',NULL,39,0,0,NULL),(53,'Medkour','$2b$10$5LeflHlSJl1QDsUXfm5ByeKcO1EVoMPuuh1mghV8XWlvTrRdTEEa2','Medkour','',38,1,1,NULL),(54,'Nassim','$2b$10$pJCzbXc7qaOg25sOUwZFNO2Yboi3jCIMwr3FFTGRX1AB5Mbm9v91e','Nassim',NULL,41,0,0,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `votes`
--

DROP TABLE IF EXISTS `votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `votes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `session_id` int NOT NULL,
  `proposition_id` int NOT NULL,
  `user_id` int NOT NULL,
  `vote_value` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `session_id` (`session_id`),
  KEY `proposition_id` (`proposition_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `votes_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `voting_sessions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `votes_ibfk_2` FOREIGN KEY (`proposition_id`) REFERENCES `propositions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `votes_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=431 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `votes`
--

LOCK TABLES `votes` WRITE;
/*!40000 ALTER TABLE `votes` DISABLE KEYS */;
INSERT INTO `votes` VALUES (412,141,1529,35,4,'2024-10-15 20:46:58','2024-10-15 20:46:58'),(413,141,1531,35,6,'2024-10-15 20:50:05','2024-10-15 20:50:05'),(414,142,1531,35,3,'2024-10-15 20:55:22','2024-10-15 20:55:22'),(415,142,1532,35,5,'2024-10-15 20:55:22','2024-10-15 20:55:22'),(416,142,1533,35,2,'2024-10-15 20:55:22','2024-10-15 20:55:22'),(417,142,1537,35,6,'2024-10-15 20:55:22','2024-10-15 20:55:22'),(418,142,1538,35,4,'2024-10-15 20:55:22','2024-10-15 20:55:22'),(419,142,1539,35,1,'2024-10-15 20:55:22','2024-10-15 20:55:22'),(420,142,1545,35,0,'2024-10-15 20:55:22','2024-10-15 20:55:22'),(421,142,1552,35,0,'2024-10-15 20:55:22','2024-10-15 20:55:22'),(422,142,1560,35,0,'2024-10-15 20:55:22','2024-10-15 20:55:22'),(423,142,1563,35,0,'2024-10-15 20:55:22','2024-10-15 20:55:22'),(424,142,1564,35,0,'2024-10-15 20:55:22','2024-10-15 20:55:22'),(425,142,1567,35,0,'2024-10-15 20:55:22','2024-10-15 20:55:22'),(426,142,1568,35,0,'2024-10-15 20:55:22','2024-10-15 20:55:22'),(427,142,1573,35,0,'2024-10-15 20:55:22','2024-10-15 20:55:22'),(428,142,1575,35,0,'2024-10-15 20:55:22','2024-10-15 20:55:22'),(429,142,1577,35,0,'2024-10-15 20:55:22','2024-10-15 20:55:22'),(430,142,1578,35,0,'2024-10-15 20:55:22','2024-10-15 20:55:22');
/*!40000 ALTER TABLE `votes` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `check_status_after_vote_insert` AFTER INSERT ON `votes` FOR EACH ROW BEGIN
  DECLARE total_jury_admins INT;
  DECLARE total_voters INT;
  DECLARE avg_grade DECIMAL(3, 2);

  -- Count total jury members and admins (adjust this query if needed based on your users table)
  SELECT COUNT(*) INTO total_jury_admins
  FROM users
  WHERE is_jury = true OR is_admin = true;

  -- Count the number of votes for the current proposition in the session
  SELECT COUNT(DISTINCT user_id) INTO total_voters
  FROM votes
  WHERE proposition_id = NEW.proposition_id
  AND session_id = NEW.session_id;

  -- Calculate the average grade for the current proposition in the session
  SELECT AVG(vote_value) INTO avg_grade
  FROM votes
  WHERE proposition_id = NEW.proposition_id
  AND session_id = NEW.session_id;

  -- Check if the number of voters matches the number of jury and admins
  IF total_voters = total_jury_admins THEN
    -- Update the proposition_status to mark it as voted
    UPDATE proposition_status
    SET is_validated = (avg_grade >= 3), is_voted = 1
    WHERE proposition_id = NEW.proposition_id
    AND voting_session_id = NEW.session_id;
  END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_average_grade_after_insert` AFTER INSERT ON `votes` FOR EACH ROW BEGIN
    DECLARE new_average_grade FLOAT;
    DECLARE jury_average_grade FLOAT;
    DECLARE normal_average_grade FLOAT;

    -- Check the type of the voting session
    IF (SELECT type FROM voting_sessions WHERE id = NEW.session_id) = 'user' THEN
        -- Calculate the average grade for jury users
        SELECT AVG(vote_value) INTO jury_average_grade
        FROM votes v
        JOIN users u ON v.user_id = u.id
        WHERE v.proposition_id = NEW.proposition_id
          AND v.session_id = NEW.session_id
          AND u.is_jury = 1;  -- Only include jury users
        
        -- Calculate the average grade for normal users (is_jury = 0)
        SELECT AVG(vote_value) INTO normal_average_grade
        FROM votes v
        JOIN users u ON v.user_id = u.id
        WHERE v.proposition_id = NEW.proposition_id
          AND v.session_id = NEW.session_id
          AND u.is_jury = 0;  -- Only include normal users

        -- Ensure the new average grade is calculated with 50% weight for jury and 50% for normal users
        SET new_average_grade = (IFNULL(jury_average_grade, 0) * 0.5) + 
                                (IFNULL(normal_average_grade, 0) * 0.5);
    ELSE
        -- Calculate the new average grade for other types of sessions
        SELECT AVG(vote_value) INTO new_average_grade
        FROM votes
        WHERE proposition_id = NEW.proposition_id
          AND session_id = NEW.session_id;
    END IF;

    -- Update the average grade in proposition_status
    UPDATE proposition_status
    SET average_grade = IFNULL(new_average_grade, 0),
        updated_at = CURRENT_TIMESTAMP
    WHERE proposition_id = NEW.proposition_id
      AND voting_session_id = NEW.session_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_average_grade_after_update` AFTER UPDATE ON `votes` FOR EACH ROW BEGIN
    DECLARE new_average_grade FLOAT;
    DECLARE jury_average_grade FLOAT;
    DECLARE normal_average_grade FLOAT;

    -- Check the type of the voting session
    IF (SELECT type FROM voting_sessions WHERE id = NEW.session_id) = 'user' THEN
        -- Calculate the average grade for jury users
        SELECT AVG(vote_value) INTO jury_average_grade
        FROM votes v
        JOIN users u ON v.user_id = u.id
        WHERE v.proposition_id = NEW.proposition_id
          AND v.session_id = NEW.session_id
          AND u.is_jury = 1;  -- Only include jury users
        
        -- Calculate the average grade for normal users (is_jury = 0)
        SELECT AVG(vote_value) INTO normal_average_grade
        FROM votes v
        JOIN users u ON v.user_id = u.id
        WHERE v.proposition_id = NEW.proposition_id
          AND v.session_id = NEW.session_id
          AND u.is_jury = 0;  -- Only include normal users

        -- Ensure the new average grade is calculated with 50% weight for jury and 50% for normal users
        SET new_average_grade = (IFNULL(jury_average_grade, 0) * 0.5) + 
                                (IFNULL(normal_average_grade, 0) * 0.5);
    ELSE
        -- Calculate the new average grade for other types of sessions
        SELECT AVG(vote_value) INTO new_average_grade
        FROM votes
        WHERE proposition_id = NEW.proposition_id
          AND session_id = NEW.session_id;
    END IF;

    -- Update the average grade in proposition_status
    UPDATE proposition_status
    SET average_grade = IFNULL(new_average_grade, 0),
        updated_at = CURRENT_TIMESTAMP
    WHERE proposition_id = NEW.proposition_id
      AND voting_session_id = NEW.session_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_average_grade_after_delete` AFTER DELETE ON `votes` FOR EACH ROW BEGIN
    DECLARE new_average_grade FLOAT;
    DECLARE jury_average_grade FLOAT;
    DECLARE normal_average_grade FLOAT;

    -- Check the type of the voting session
    IF (SELECT type FROM voting_sessions WHERE id = OLD.session_id) = 'user' THEN
        -- Calculate the average grade for jury users
        SELECT AVG(vote_value) INTO jury_average_grade
        FROM votes v
        JOIN users u ON v.user_id = u.id
        WHERE v.proposition_id = OLD.proposition_id
          AND v.session_id = OLD.session_id
          AND u.is_jury = 1;  -- Only include jury users
        
        -- Calculate the average grade for normal users (is_jury = 0)
        SELECT AVG(vote_value) INTO normal_average_grade
        FROM votes v
        JOIN users u ON v.user_id = u.id
        WHERE v.proposition_id = OLD.proposition_id
          AND v.session_id = OLD.session_id
          AND u.is_jury = 0;  -- Only include normal users

        -- Ensure the new average grade is calculated with 50% weight for jury and 50% for normal users
        SET new_average_grade = (IFNULL(jury_average_grade, 0) * 0.5) + 
                                (IFNULL(normal_average_grade, 0) * 0.5);
    ELSE
        -- Calculate the new average grade for other types of sessions
        SELECT AVG(vote_value) INTO new_average_grade
        FROM votes
        WHERE proposition_id = OLD.proposition_id
          AND session_id = OLD.session_id;
    END IF;

    -- Update the average grade in proposition_status
    UPDATE proposition_status
    SET average_grade = IFNULL(new_average_grade, 0),
        updated_at = CURRENT_TIMESTAMP
    WHERE proposition_id = OLD.proposition_id
      AND voting_session_id = OLD.session_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `voting_sessions`
--

DROP TABLE IF EXISTS `voting_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `voting_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `init_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `started` tinyint DEFAULT '0',
  `start_time` datetime DEFAULT NULL,
  `ended` tinyint DEFAULT '0',
  `end_time` datetime DEFAULT NULL,
  `type` enum('jury','user') NOT NULL,
  `is_active` tinyint DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=143 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voting_sessions`
--

LOCK TABLES `voting_sessions` WRITE;
/*!40000 ALTER TABLE `voting_sessions` DISABLE KEYS */;
INSERT INTO `voting_sessions` VALUES (141,'2024-10-15 13:36:15',1,'2024-10-15 21:46:40',1,'2024-10-15 21:51:58','jury',0),(142,'2024-10-15 21:53:16',1,'2024-10-15 21:54:24',1,'2024-10-15 21:57:06','user',0);
/*!40000 ALTER TABLE `voting_sessions` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `set_start_time` BEFORE UPDATE ON `voting_sessions` FOR EACH ROW BEGIN
    IF NEW.started = 1 AND OLD.started = 0 THEN
        SET NEW.start_time = NOW();
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `set_end_time` BEFORE UPDATE ON `voting_sessions` FOR EACH ROW BEGIN
    IF NEW.ended = 1 AND OLD.ended = 0 THEN
        SET NEW.end_time = NOW();
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `reset_propositions_after_session_delete` BEFORE DELETE ON `voting_sessions` FOR EACH ROW BEGIN
     UPDATE propositions p
     JOIN proposition_status ps ON p.id = ps.proposition_id
     SET p.is_excluded = 0, 
         p.locked = 0
     WHERE ps.voting_session_id = OLD.id;
 END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Dumping events for database 'proposif'
--

--
-- Dumping routines for database 'proposif'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-16  1:42:08
