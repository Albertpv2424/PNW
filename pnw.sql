-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-05-2025 a las 13:26:56
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pnw`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `apuestas`
--

CREATE TABLE `apuestas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `tipo_apuesta` varchar(255) NOT NULL,
  `estado` varchar(255) NOT NULL DEFAULT 'pendiente',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `admin_id` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `read` tinyint(1) NOT NULL DEFAULT 0,
  `chat_session_id` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `user_id`, `admin_id`, `message`, `is_admin`, `read`, `chat_session_id`, `created_at`, `updated_at`) VALUES
(48, 'Albertpv24', NULL, '¡Hola! Necesito ayuda con mi cuenta.', 0, 0, 'b5802ba7-a15a-4250-b5fa-48cdf617db88', '2025-04-08 13:07:12', '2025-04-08 13:07:12'),
(49, 'Albertpv24', NULL, 'Hola soc l omar', 0, 0, 'b5802ba7-a15a-4250-b5fa-48cdf617db88', '2025-04-08 13:07:21', '2025-04-08 13:07:21'),
(50, 'admin', NULL, 'Hola omar', 1, 1, 'b5802ba7-a15a-4250-b5fa-48cdf617db88', '2025-04-08 13:07:29', '2025-04-08 13:07:33'),
(51, 'Albertpv24', NULL, '¡Hola! Necesito ayuda con mi cuenta.', 0, 0, '3a7e08bc-c259-4109-afda-2a67ccccc5a1', '2025-04-11 12:26:55', '2025-04-11 12:26:55'),
(52, 'Albertpv24', NULL, '¡Hola! Necesito ayuda con mi cuenta.', 0, 0, '14155475-798c-4be1-b207-c61cf37c74c7', '2025-04-11 12:31:24', '2025-04-11 12:31:24'),
(53, 'Albertpv24', NULL, 'Hola buenas', 0, 0, '14155475-798c-4be1-b207-c61cf37c74c7', '2025-04-11 12:33:01', '2025-04-11 12:33:01'),
(56, 'Albertpv24', NULL, '¡Hola! Necesito ayuda.', 0, 0, '3f4a7c2c-7479-4034-ac06-1edf97255043', '2025-04-11 14:58:52', '2025-04-11 14:58:52'),
(61, 'Albertpv24', NULL, 'Ciao! Ho bisogno di aiuto.', 0, 0, '25a44dfc-3ae6-4599-bf1f-52975d3de824', '2025-04-13 13:09:51', '2025-04-13 13:09:51'),
(62, 'admin', NULL, '¡Hola! Necesito ayuda.', 0, 0, '57cd5f58-c759-42b1-bdf2-6ccf07419ca9', '2025-04-13 16:23:34', '2025-04-13 16:23:34'),
(63, 'Albertpv24', NULL, '¡Hola! Necesito ayuda.', 0, 0, '6738fd07-ea93-4731-92cd-a4ffdd1b2013', '2025-04-13 16:28:14', '2025-04-13 16:28:14'),
(64, 'Albertpv24', NULL, 'Bonjour ! J\'ai besoin d\'aide.', 0, 0, 'd3f8ace4-e052-42f3-9d2e-4bac5c209d56', '2025-04-13 16:28:46', '2025-04-13 16:28:46'),
(65, 'Albertpv24', NULL, '你好！我需要帮助。', 0, 0, '0639cfa2-9ca3-4d6a-a876-221f4b6e1e9c', '2025-04-13 16:31:05', '2025-04-13 16:31:05'),
(66, 'Albertpv24', NULL, '¡Hola! Necesito ayuda.', 0, 0, '036efabb-a887-4ba7-b562-c1dcf6e3bba7', '2025-05-02 11:27:43', '2025-05-02 11:27:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chat_sessions`
--

CREATE TABLE `chat_sessions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `admin_id` varchar(255) DEFAULT NULL,
  `last_message` text DEFAULT NULL,
  `last_message_time` timestamp NULL DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `chat_sessions`
--

INSERT INTO `chat_sessions` (`id`, `session_id`, `user_id`, `admin_id`, `last_message`, `last_message_time`, `active`, `created_at`, `updated_at`) VALUES
(20, 'b5802ba7-a15a-4250-b5fa-48cdf617db88', 'Albertpv24', 'admin', 'Hola omar', '2025-04-08 13:07:29', 1, '2025-04-08 13:07:12', '2025-04-08 13:07:29'),
(21, '3a7e08bc-c259-4109-afda-2a67ccccc5a1', 'Albertpv24', 'admin', '¡Hola! Necesito ayuda con mi cuenta.', '2025-04-11 12:26:55', 1, '2025-04-11 12:26:55', '2025-04-11 12:26:55'),
(22, '14155475-798c-4be1-b207-c61cf37c74c7', 'Albertpv24', 'admin', 'Hola buenas', '2025-04-11 12:33:01', 1, '2025-04-11 12:31:24', '2025-04-11 12:33:01'),
(25, '3f4a7c2c-7479-4034-ac06-1edf97255043', 'Albertpv24', 'admin', '¡Hola! Necesito ayuda.', '2025-04-11 14:58:52', 1, '2025-04-11 14:58:52', '2025-04-11 14:58:52'),
(28, '25a44dfc-3ae6-4599-bf1f-52975d3de824', 'Albertpv24', 'admin', 'Ciao! Ho bisogno di aiuto.', '2025-04-13 13:09:51', 1, '2025-04-13 13:09:51', '2025-04-13 13:09:51'),
(29, '57cd5f58-c759-42b1-bdf2-6ccf07419ca9', 'admin', 'admin', '¡Hola! Necesito ayuda.', '2025-04-13 16:23:34', 1, '2025-04-13 16:23:34', '2025-04-13 16:23:34'),
(30, '6738fd07-ea93-4731-92cd-a4ffdd1b2013', 'Albertpv24', 'admin', '¡Hola! Necesito ayuda.', '2025-04-13 16:28:14', 1, '2025-04-13 16:28:14', '2025-04-13 16:28:14'),
(31, 'd3f8ace4-e052-42f3-9d2e-4bac5c209d56', 'Albertpv24', 'admin', 'Bonjour ! J\'ai besoin d\'aide.', '2025-04-13 16:28:46', 1, '2025-04-13 16:28:46', '2025-04-13 16:28:46'),
(32, '0639cfa2-9ca3-4d6a-a876-221f4b6e1e9c', 'Albertpv24', 'admin', '你好！我需要帮助。', '2025-04-13 16:31:05', 1, '2025-04-13 16:31:05', '2025-04-13 16:31:05'),
(33, '036efabb-a887-4ba7-b562-c1dcf6e3bba7', 'Albertpv24', 'admin', '¡Hola! Necesito ayuda.', '2025-05-02 11:27:43', 1, '2025-05-02 11:27:43', '2025-05-02 11:27:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `daily_rewards_tracking`
--

CREATE TABLE `daily_rewards_tracking` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `usuari_nick` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `wheel_spun` tinyint(1) NOT NULL DEFAULT 0,
  `wheel_points_earned` int(11) NOT NULL DEFAULT 0,
  `videos_watched` int(11) NOT NULL DEFAULT 0,
  `video_points_earned` int(11) NOT NULL DEFAULT 0,
  `bets_today` int(11) NOT NULL DEFAULT 0,
  `max_daily_bets` int(11) NOT NULL DEFAULT 5,
  `betting_time_today` int(11) NOT NULL DEFAULT 0,
  `max_daily_betting_time` int(11) NOT NULL DEFAULT 3600,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `daily_rewards_tracking`
--

INSERT INTO `daily_rewards_tracking` (`id`, `usuari_nick`, `date`, `wheel_spun`, `wheel_points_earned`, `videos_watched`, `video_points_earned`, `bets_today`, `max_daily_bets`, `betting_time_today`, `max_daily_betting_time`, `created_at`, `updated_at`) VALUES
(1, 'Wispy', '2025-03-18', 1, 25, 1, 22, 0, 5, 0, 3600, '2025-03-18 15:25:15', '2025-03-18 15:26:46'),
(2, 'Albertpv24', '2025-03-18', 1, 500, 0, 0, 0, 5, 0, 3600, '2025-03-18 15:37:00', '2025-03-18 20:45:07'),
(6, 'Albertpv24', '2025-03-21', 1, 75, 0, 0, 0, 5, 0, 3600, '2025-03-21 09:25:58', '2025-03-21 09:35:44'),
(8, 'Albertpv24', '2025-04-06', 1, 50, 0, 0, 0, 5, 0, 3600, '2025-04-06 12:01:15', '2025-04-06 12:01:15'),
(10, 'Albertpv24', '2025-04-07', 1, 200, 0, 0, 0, 5, 0, 3600, '2025-04-07 11:39:25', '2025-04-07 11:39:25'),
(11, 'Albertpv24', '2025-04-08', 1, 75, 1, 30, 0, 5, 0, 3600, '2025-04-08 12:32:58', '2025-04-08 12:47:33'),
(13, 'Albertpv24', '2025-04-10', 1, 10, 0, 0, 0, 5, 0, 3600, '2025-04-10 12:11:56', '2025-04-10 12:11:56'),
(14, 'Albertpv24', '2025-04-11', 1, 25, 0, 0, 0, 5, 0, 3600, '2025-04-11 11:34:33', '2025-04-11 11:34:33'),
(17, 'Albertpv24', '2025-04-13', 1, 75, 0, 0, 0, 5, 0, 3600, '2025-04-13 13:08:08', '2025-04-13 13:08:08'),
(18, 'Albertpv24', '2025-04-26', 0, 0, 0, 0, 1, 4, 807, 3600, '2025-04-26 07:55:24', '2025-04-26 12:47:50'),
(19, 'admin', '2025-04-26', 0, 0, 0, 0, 0, 5, 1607, 2147483647, '2025-04-26 07:56:16', '2025-04-26 12:46:49'),
(20, 'Albertpv24', '2025-04-27', 0, 0, 0, 0, 0, 5, 0, 3600, '2025-04-27 11:25:20', '2025-04-27 11:25:20'),
(21, 'Albertpv24', '2025-04-29', 0, 0, 0, 0, 2, 2, 595, 600, '2025-04-29 08:38:52', '2025-04-29 09:07:15'),
(22, 'admin', '2025-04-29', 0, 0, 0, 0, 0, 5, 1360, 3600, '2025-04-29 08:39:00', '2025-04-29 09:07:16'),
(24, 'Albertpv24', '2025-04-30', 0, 0, 0, 0, 0, 5, 26, 3600, '2025-04-30 09:23:12', '2025-04-30 09:24:10'),
(25, 'Albertpv24', '2025-05-02', 0, 0, 0, 0, 0, 5, 505, 3600, '2025-05-02 11:27:33', '2025-05-02 21:33:57'),
(28, 'Albertpv24', '2025-05-10', 0, 0, 0, 0, 0, 5, 1570, 3600, '2025-05-10 10:19:56', '2025-05-10 13:02:03'),
(30, 'admin', '2025-05-10', 0, 0, 0, 0, 0, 5, 3462, 8000, '2025-05-10 14:41:53', '2025-05-10 16:31:23'),
(31, 'admin', '2025-05-13', 0, 0, 0, 0, 0, 5, 3600, 3600, '2025-05-13 17:12:02', '2025-05-13 19:05:14'),
(32, 'Albertpv24', '2025-05-13', 0, 0, 0, 0, 0, 5, 0, 3600, '2025-05-13 17:12:12', '2025-05-13 17:12:12'),
(33, 'admin', '2025-05-14', 0, 0, 0, 0, 0, 5, 4757, 9000, '2025-05-14 07:03:35', '2025-05-14 09:26:49'),
(35, 'Juan', '2025-05-14', 0, 0, 0, 0, 0, 5, 0, 3600, '2025-05-14 08:35:23', '2025-05-14 08:35:23'),
(36, 'Laura', '2025-05-14', 0, 0, 0, 0, 0, 5, 1, 3600, '2025-05-14 08:36:41', '2025-05-14 08:36:51');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_prediccio`
--

CREATE TABLE `detalle_prediccio` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `prediccio_proposada_id` bigint(20) UNSIGNED NOT NULL,
  `match_id` varchar(255) NOT NULL,
  `equipo` varchar(255) NOT NULL,
  `tipo_apuesta` varchar(255) NOT NULL,
  `cuota` decimal(10,2) NOT NULL,
  `match_info` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `detalle_prediccio`
--

INSERT INTO `detalle_prediccio` (`id`, `prediccio_proposada_id`, `match_id`, `equipo`, `tipo_apuesta`, `cuota`, `match_info`, `created_at`, `updated_at`) VALUES
(1, 1, '7870be3e8c8ac05798da0a844571f6f7', 'Aston Villa', 'h2h', 7.00, 'UEFA Champions League: Paris Saint Germain vs Aston Villa', '2025-03-18 15:25:38', '2025-03-18 15:25:38'),
(2, 2, '2162b24f54d968d430da71037503dfcc', 'Barcelona', 'h2h', 1.40, 'UEFA Champions League: Barcelona vs Borussia Dortmund', '2025-03-18 15:27:19', '2025-03-18 15:27:19'),
(3, 3, '669cb87a46c56ab00d788ec520481b3a', 'Leganés', 'h2h', 14.00, 'La Liga - Spain: Real Madrid vs Leganés', '2025-03-20 21:55:17', '2025-03-20 21:55:17'),
(4, 3, 'de1a04fc86dc062151afe5c98a96258a', 'Alavés', 'h2h', 2.30, 'La Liga - Spain: Alavés vs Rayo Vallecano', '2025-03-20 21:55:17', '2025-03-20 21:55:17'),
(5, 3, '2162b24f54d968d430da71037503dfcc', 'Barcelona', 'h2h', 1.40, 'UEFA Champions League: Barcelona vs Borussia Dortmund', '2025-03-20 21:55:17', '2025-03-20 21:55:17'),
(6, 4, '268e4818f0941be692b1496fdf70dee4', 'Villarreal', 'h2h', 2.30, 'La Liga - Spain: Getafe vs Villarreal', '2025-03-21 09:03:42', '2025-03-21 09:03:42'),
(7, 4, '3eac51545c1860f07789ca6be6464e58', 'Valladolid', 'h2h', 4.20, 'La Liga - Spain: Valladolid vs Getafe', '2025-03-21 09:03:42', '2025-03-21 09:03:42'),
(13, 7, 'c250cd9784712b609000f9af50a0ba04', 'Real Madrid', 'h2h', 1.62, 'La Liga - Spain: Alavés vs Real Madrid', '2025-04-08 13:56:50', '2025-04-08 13:56:50'),
(14, 7, '1ad1f20f8b22abf90405d038b86a49f2', 'Bayern München', 'h2h', 2.04, 'UEFA Champions League: Bayern München vs Internazionale Milano', '2025-04-08 13:56:50', '2025-04-08 13:56:50'),
(19, 10, '8d5af0f27f5f71819ccd71affe8dc0cb', 'Arsenal', 'h2h', 2.14, 'UEFA Champions League: Arsenal vs Paris Saint Germain', '2025-04-26 12:46:34', '2025-04-26 12:46:34'),
(20, 11, '7c1356c013bd5f0edf0b818a84dd0f4d', 'Rayo Vallecano', 'h2h', 2.37, 'La Liga - Spain: Rayo Vallecano vs Getafe', '2025-04-29 08:40:37', '2025-04-29 08:40:37'),
(21, 12, '69adaff1793eaf53545ede5afdbd5ac1', 'Barcelona', 'h2h', 1.83, 'La Liga - Spain: Barcelona vs Real Madrid', '2025-04-29 08:51:56', '2025-04-29 08:51:56');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `idiomas`
--

CREATE TABLE `idiomas` (
  `id` int(11) NOT NULL,
  `codigo_iso` varchar(5) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `idiomas`
--

INSERT INTO `idiomas` (`id`, `codigo_iso`, `nombre`) VALUES
(1, 'es', 'Español'),
(2, 'en', 'English'),
(3, 'it', 'Italiano'),
(4, 'ca', 'Català'),
(5, 'fr', 'Français'),
(6, 'de', 'Deutsch'),
(7, 'zh', '中文');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripcio_a_promos`
--

CREATE TABLE `inscripcio_a_promos` (
  `usuari_nick` varchar(50) NOT NULL,
  `promo_id` bigint(20) UNSIGNED NOT NULL,
  `data_inscripcio` timestamp NULL DEFAULT NULL,
  `compleix_requisits` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `inscripcio_a_promos`
--

INSERT INTO `inscripcio_a_promos` (`usuari_nick`, `promo_id`, `data_inscripcio`, `compleix_requisits`) VALUES
('Albertpv24', 1, '2025-05-13 17:12:53', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `limitacio`
--

CREATE TABLE `limitacio` (
  `usuari_nick` varchar(50) NOT NULL,
  `apostes_diaries` int(11) NOT NULL DEFAULT 0,
  `temps_diari` int(11) NOT NULL DEFAULT 0,
  `punts_apostats` int(11) NOT NULL DEFAULT 0,
  `apostes_maximes_diaries` int(11) NOT NULL DEFAULT 5
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(2, '2025_03_05_182919_crear_tipus_promocio', 1),
(3, '2025_03_05_182929_crear_usuaris', 1),
(4, '2025_03_05_183009_crear_user_sist', 1),
(5, '2025_03_05_183015_crear_promos', 1),
(6, '2025_03_05_183018_crear_inscripcio_a_promos', 1),
(7, '2025_03_05_183022_crear_limitacio', 1),
(8, '2025_03_05_183025_crear_premis', 1),
(9, '2025_03_05_183028_crear_premis_usuaris', 1),
(10, '2025_03_05_183033_crear_prediccio_proposada', 1),
(11, '2025_03_05_183036_crear_resultat_prediccio', 1),
(12, '2025_03_05_183042_crear_prediccions_sist', 1),
(13, '2025_03_05_183050_create_daily_rewards_tracking_table', 1),
(14, '2025_03_06_000000_crear_detalle_prediccio', 1),
(15, 'add_data_inscripcio_to_inscripcio_a_promos', 1),
(16, 'add_image_to_premis_and_promos', 1),
(17, 'add_profile_image_to_usuaris_table', 1),
(18, 'create_password_resets_table', 1),
(19, 'update_personal_access_tokens_table', 1),
(20, '2025_03_06_000000_add_betting_limitations_to_daily_rewards', 2),
(21, '2025_04_04_165907_create_chat_sessions_table', 3),
(23, '2025_04_04_165908_create_chat_messages_table', 4),
(24, '2025_05_14_095654_fix_user_deletion_tables', 5),
(25, '2025_05_xx_update_chat_messages_foreign_key', 5),
(26, 'fix_user_deletion_tables', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `password_resets`
--

INSERT INTO `password_resets` (`email`, `token`, `created_at`) VALUES
('albertpv24@alumnes.ilerna.com', 'YatJh0gcZVXW0mstH7qy5C7aaBlIwkrv5QgtrJtb6cHwIjF220C1eK7BxtJ1', '2025-05-02 22:34:39'),
('albertpv24@gmail.com', 'jlnB36JbS6TcikySJgP8fucDXQc0dSlBU0YGFnAt6IyLzJdKSizPrjNCa9xd', '2025-04-11 14:39:57'),
('rororoalalal@gmail.com', 'q0RXyll3Z2vdLHNOk4oMEZ9wJPu4pSPCHeUVYKWS82gRaDjo6AfXFJnfcuu5', '2025-04-11 17:52:29');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 'Wispy', 'auth-token', '802ca8c3a60af28da14568edc4195b4d9a6dbb357c49054da0f2f4fd1f5dd447', '[\"*\"]', '2025-03-18 15:27:19', NULL, '2025-03-18 15:25:11', '2025-03-18 15:27:19'),
(2, 'App\\Models\\User', 'Albertpv24', 'auth-token', '3f0396d9aa93a2225ddeb55c57c7d79a502783687637cef951670e13c00e86b1', '[\"*\"]', '2025-03-18 15:42:32', NULL, '2025-03-18 15:36:59', '2025-03-18 15:42:32'),
(3, 'App\\Models\\User', 'admin', 'auth-token', '7279251df734f5ccd9d42350ee104296236890d1d83d920d0252fc0fb3721982', '[\"*\"]', '2025-03-18 19:00:35', NULL, '2025-03-18 18:40:15', '2025-03-18 19:00:35'),
(4, 'App\\Models\\User', 'admin', 'auth-token', '28be5a92f357521a74838f1a9f44d141762785d8cf30fd95269256c55afa239d', '[\"*\"]', '2025-03-18 19:34:16', NULL, '2025-03-18 19:00:42', '2025-03-18 19:34:16'),
(5, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'cae92f274a2c3d568928f887f0e4116bc3fea9bda39d5e92055bcf690aeff2f3', '[\"*\"]', NULL, NULL, '2025-03-18 19:35:16', '2025-03-18 19:35:16'),
(6, 'App\\Models\\User', 'admin', 'auth-token', 'ab4086b167b5283dbc63548cda5d1baae928b64478d9b8e68789b3e70fb2318f', '[\"*\"]', '2025-03-18 20:16:28', NULL, '2025-03-18 19:36:05', '2025-03-18 20:16:28'),
(7, 'App\\Models\\User', 'Albertpv24', 'auth-token', '28e3abf73c28a1891252f1bc19ad78b8baead00911f6a0f883248a5a53861a2c', '[\"*\"]', NULL, NULL, '2025-03-18 20:17:08', '2025-03-18 20:17:08'),
(8, 'App\\Models\\User', 'admin', 'auth-token', '6fb7188d8295c12e1ad34f589dc6b73e285f3605468116a2c684344861fa182a', '[\"*\"]', '2025-03-18 20:18:13', NULL, '2025-03-18 20:17:54', '2025-03-18 20:18:13'),
(9, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'ffbf0280875669765eb0fb718fe6db6e658ee3b15d9d2f11c34f566d6add5687', '[\"*\"]', NULL, NULL, '2025-03-18 20:18:45', '2025-03-18 20:18:45'),
(10, 'App\\Models\\User', 'admin', 'auth-token', 'cbf5ad174c5a100afa8edfe3bd642df4fd0963b7506fe6beed4cfcc414df3f90', '[\"*\"]', '2025-03-18 20:20:40', NULL, '2025-03-18 20:20:35', '2025-03-18 20:20:40'),
(11, 'App\\Models\\User', 'Albertpv24', 'auth-token', '64cbd2d087f389aaad6ef24ca9d3590f9bcc4fd339c8dd1e57a44ec34fecf6ad', '[\"*\"]', '2025-03-18 20:23:46', NULL, '2025-03-18 20:20:46', '2025-03-18 20:23:46'),
(12, 'App\\Models\\User', 'Popi', 'auth-token', 'b24fd365b3e71033dd7755a310c6b08f5068fe2c6492a1dafb1ef58429ef7c3a', '[\"*\"]', '2025-03-18 20:29:59', NULL, '2025-03-18 20:24:55', '2025-03-18 20:29:59'),
(13, 'App\\Models\\User', 'admin', 'auth-token', '76616036149bc0a6ddced82d56d96652fef46983efd5a0b1d42b92626716f5e0', '[\"*\"]', '2025-03-18 20:43:08', NULL, '2025-03-18 20:30:36', '2025-03-18 20:43:08'),
(14, 'App\\Models\\User', 'Albertpv24', 'auth-token', '2601bf62bf9fd509594ae8cdec7d9d0497f6ea72dde75a38ffb15310504ea84f', '[\"*\"]', '2025-03-18 20:45:07', NULL, '2025-03-18 20:44:51', '2025-03-18 20:45:07'),
(15, 'App\\Models\\User', 'admin', 'auth-token', 'ba752960eae64ec20b7ae23192dd3313702f846dd566eb89e33d115a5dae5d31', '[\"*\"]', '2025-03-18 20:48:22', NULL, '2025-03-18 20:46:49', '2025-03-18 20:48:22'),
(16, 'App\\Models\\User', 'admin', 'auth-token', '00c49f64ff244b2b25646a5c01112f1217b67e4269a66d68cf451d02b135423a', '[\"*\"]', '2025-03-20 21:35:38', NULL, '2025-03-18 21:03:14', '2025-03-20 21:35:38'),
(17, 'App\\Models\\User', 'Albertpv24', 'auth-token', '7cf20834e23e5dc2fd027545124d7cb4e7a85dd57b7e0b32ad86f98dfd50dcb0', '[\"*\"]', '2025-03-20 21:43:53', NULL, '2025-03-20 21:35:50', '2025-03-20 21:43:53'),
(18, 'App\\Models\\User', 'admin', 'auth-token', 'a1f4a4f5fc6b7757a1588e2b009a150c9955df2a92222970f0f8c55856a18830', '[\"*\"]', '2025-03-20 21:45:28', NULL, '2025-03-20 21:44:44', '2025-03-20 21:45:28'),
(19, 'App\\Models\\User', 'Albertpv24', 'auth-token', '44aee931ad00f2b54e339e3988fc5216a2c2c10774922b8841056e2ee1b00256', '[\"*\"]', '2025-03-20 21:55:17', NULL, '2025-03-20 21:45:59', '2025-03-20 21:55:17'),
(20, 'App\\Models\\User', 'admin', 'auth-token', '2f5a99732d3573090368d0856d3dd8f380f984211d26840356673afe73220240', '[\"*\"]', '2025-03-20 21:55:34', NULL, '2025-03-20 21:55:27', '2025-03-20 21:55:34'),
(21, 'App\\Models\\User', 'Albertpv24', 'auth-token', '66a117d2c0bdc1905a031bdb776b4c683d86279c4cbf5592465e1dcccfefe8da', '[\"*\"]', '2025-03-20 21:55:57', NULL, '2025-03-20 21:55:43', '2025-03-20 21:55:57'),
(22, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'da5b15553a8e94384cfb499973e5ec5f01d744bee69d59211e3d3b74ff2a6185', '[\"*\"]', '2025-03-21 08:46:49', NULL, '2025-03-20 21:56:44', '2025-03-21 08:46:49'),
(23, 'App\\Models\\User', 'Albertpv24', 'auth-token', '15600134bfbca3948ab0598332301475d8033caec6383c0eca4703a64cb1d73b', '[\"*\"]', '2025-03-21 08:56:23', NULL, '2025-03-21 08:47:03', '2025-03-21 08:56:23'),
(24, 'App\\Models\\User', 'Albertpv24', 'auth-token', '623e4c720f159b615c12a937246b1538fc3c9f6662ffbaf1f5aba8482378be39', '[\"*\"]', NULL, NULL, '2025-03-21 08:56:37', '2025-03-21 08:56:37'),
(25, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'd34cab51a50d99f74fae6551cc0b9ea528b5a1796fa0d0b86c6aa3d87ce28f02', '[\"*\"]', '2025-03-21 09:25:24', NULL, '2025-03-21 08:56:54', '2025-03-21 09:25:24'),
(26, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'e44e74110018f99f7f21f2c3d162286c0e47e14265a25efbbfc377fc8d948dc2', '[\"*\"]', '2025-03-21 09:26:07', NULL, '2025-03-21 09:25:36', '2025-03-21 09:26:07'),
(27, 'App\\Models\\User', 'Albertpv24', 'auth-token', '2f11a6cad5ef66f78e855e45c6198b6c46acbab01a2dd5b70908afffe2f7d2fd', '[\"*\"]', '2025-03-21 09:34:59', NULL, '2025-03-21 09:26:24', '2025-03-21 09:34:59'),
(28, 'App\\Models\\User', 'Albertpv24', 'auth-token', '8de223a5963a5756735bfc68d3a49448be67737d05360bb5787788093eb932a7', '[\"*\"]', '2025-03-21 09:35:55', NULL, '2025-03-21 09:35:10', '2025-03-21 09:35:55'),
(29, 'App\\Models\\User', 'Prova', 'auth-token', '109c68e7cbcc074a19c598f085c7f1360882a11aa4faa455e77f2ad776e5eb07', '[\"*\"]', '2025-03-21 09:40:32', NULL, '2025-03-21 09:38:55', '2025-03-21 09:40:32'),
(30, 'App\\Models\\User', 'admin', 'auth-token', '9275fdf8cd3590c01698b4feaea5b410638ea4c581c3dc73fdcdcc17ce040d73', '[\"*\"]', '2025-03-21 09:41:16', NULL, '2025-03-21 09:40:39', '2025-03-21 09:41:16'),
(31, 'App\\Models\\User', 'Prova', 'auth-token', '4c8a102a706e49619546558f7d32918210976420138eed72647c54bd6f387677', '[\"*\"]', '2025-03-21 09:41:49', NULL, '2025-03-21 09:41:27', '2025-03-21 09:41:49'),
(32, 'App\\Models\\User', 'admin', 'auth-token', 'd9f8ccfdafb6ff00dc6e1b823d634bfcce3124a75356c308bd26a1f68e24f069', '[\"*\"]', '2025-03-21 09:42:11', NULL, '2025-03-21 09:42:10', '2025-03-21 09:42:11'),
(33, 'App\\Models\\User', 'Prova', 'auth-token', '8a3668f3bd58731d3ff9e5bfef4bfcc558ac06a2d098ea8fcbf5e355e5f23309', '[\"*\"]', '2025-03-21 09:42:37', NULL, '2025-03-21 09:42:24', '2025-03-21 09:42:37'),
(34, 'App\\Models\\User', 'Albertpv24', 'auth-token', '4aa50b3a67c1459472a0c895b1b55a9f79acd043fa3435ed05c675e405df7710', '[\"*\"]', '2025-03-21 09:49:14', NULL, '2025-03-21 09:43:30', '2025-03-21 09:49:14'),
(35, 'App\\Models\\User', 'Albertpv24', 'auth-token', '734875c9ba2e529b8822867c02d657f3df38a0bcc29776f282168380328c4d43', '[\"*\"]', '2025-04-06 09:36:11', NULL, '2025-04-06 08:18:33', '2025-04-06 09:36:11'),
(36, 'App\\Models\\User', 'admin', 'auth-token', '6404bf27961b951ff7439435ab8607b84b138233a4c67355cb9ba2541c282037', '[\"*\"]', '2025-04-06 08:24:29', NULL, '2025-04-06 08:18:50', '2025-04-06 08:24:29'),
(37, 'App\\Models\\User', 'admin', 'auth-token', 'e5139677f9794bb584c2de97ec59b2a05f8fa169628948208cf964d388b26535', '[\"*\"]', '2025-04-06 08:31:54', NULL, '2025-04-06 08:24:34', '2025-04-06 08:31:54'),
(38, 'App\\Models\\User', 'admin', 'auth-token', 'f2e64eba2f824b16a3c92bb8f915a6e6311fe709c0c1c9442558c4291cda826e', '[\"*\"]', '2025-04-06 12:51:01', NULL, '2025-04-06 08:32:23', '2025-04-06 12:51:01'),
(39, 'App\\Models\\User', 'Albertpv24', 'auth-token', '860d1145e40f0cd52581b211cf7dad45748047638d5ef46f84966a236be31a23', '[\"*\"]', '2025-04-06 09:39:04', NULL, '2025-04-06 09:38:48', '2025-04-06 09:39:04'),
(40, 'App\\Models\\User', 'Popi', 'auth-token', '7fdca5a4ac9b9fd009b10de7d3f7b67b4730d8758752b3fd42392320c593f518', '[\"*\"]', '2025-04-06 09:57:02', NULL, '2025-04-06 09:39:32', '2025-04-06 09:57:02'),
(41, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'f84210b5bac9fc1da460bbbb46ae285f4c748b59aab40b9bae2b3c0ca1674360', '[\"*\"]', '2025-04-06 09:57:24', NULL, '2025-04-06 09:57:15', '2025-04-06 09:57:24'),
(42, 'App\\Models\\User', 'Popi', 'auth-token', 'ab2671ff2eb7edce4e2c5350cd886e674496ce6df56b74bbf1ba2103df356fea', '[\"*\"]', '2025-04-06 09:59:20', NULL, '2025-04-06 09:58:55', '2025-04-06 09:59:20'),
(43, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'e604b1c663322b60fc6b0a4153ee03dbf52f12771bafb4f7ea7ebd98ca00e092', '[\"*\"]', '2025-04-06 10:02:58', NULL, '2025-04-06 09:59:30', '2025-04-06 10:02:58'),
(44, 'App\\Models\\User', 'Popi', 'auth-token', '55cb66a3a78baa9513421d86f157155015e55d5374accaebac34eac2aedff5b4', '[\"*\"]', '2025-04-06 10:03:19', NULL, '2025-04-06 10:03:09', '2025-04-06 10:03:19'),
(46, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'ff536813a50df30f04a44220921096bddf5010b662ce2184f0acff07e38c53bc', '[\"*\"]', '2025-04-06 10:12:19', NULL, '2025-04-06 10:09:46', '2025-04-06 10:12:19'),
(48, 'App\\Models\\User', 'Popi', 'auth-token', '2321fc258b5340028dd9dde35ced527fb43dfc98d17d1abf7fbe0364f98fc610', '[\"*\"]', '2025-04-06 10:26:38', NULL, '2025-04-06 10:17:09', '2025-04-06 10:26:38'),
(49, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'f324d380fb8c991cc946aa28dcd919099eb90f6003f40b22174b2ee31d615aad', '[\"*\"]', '2025-04-06 12:17:53', NULL, '2025-04-06 10:33:01', '2025-04-06 12:17:53'),
(50, 'App\\Models\\User', 'Albertpv24', 'auth-token', '0021f47ef6b4c117058ad9b1453ca0215b586b40a6e0d5c3a659dde3c5eb7228', '[\"*\"]', '2025-04-06 18:05:35', NULL, '2025-04-06 12:18:11', '2025-04-06 18:05:35'),
(52, 'App\\Models\\User', 'admin', 'auth-token', 'fa316a56456852730435d527df72505da84909fb05e925be6116d05906339d0b', '[\"*\"]', '2025-04-06 18:12:38', NULL, '2025-04-06 18:09:42', '2025-04-06 18:12:38'),
(54, 'App\\Models\\User', 'admin', 'auth-token', 'be4fac6833ed336eec3622eec5ab3ab3fb5cb2ab0e71d680c5a326423113633c', '[\"*\"]', '2025-04-07 16:17:27', NULL, '2025-04-07 11:37:47', '2025-04-07 16:17:27'),
(55, 'App\\Models\\User', 'Albertpv24', 'auth-token', '3cf2b6a473a0df47edea9d52a3d9b1579bbe351cb6bc7117db35a31504e675eb', '[\"*\"]', '2025-04-08 12:19:45', NULL, '2025-04-07 11:38:03', '2025-04-08 12:19:45'),
(56, 'App\\Models\\User', 'admin', 'auth-token', 'cae13185609b7a49b18b7da4da259be82ec852923e6b6c2b00c377162d4d882e', '[\"*\"]', '2025-04-08 16:16:58', NULL, '2025-04-08 11:28:25', '2025-04-08 16:16:58'),
(57, 'App\\Models\\User', 'Albertpv24', 'auth-token', '07fc3bacb92d1c40277a73fad262104aad393a50fa0bbf1c6413cf5cbd8c862a', '[\"*\"]', '2025-04-08 12:52:25', NULL, '2025-04-08 12:19:54', '2025-04-08 12:52:25'),
(58, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'ad2fb8910d9dbcce2d90fbd452b2d63788e86bbcc5cfff7ced7e9a9a5e91c19d', '[\"*\"]', '2025-04-08 12:54:13', NULL, '2025-04-08 12:53:19', '2025-04-08 12:54:13'),
(59, 'App\\Models\\User', 'Albertpv24', 'auth-token', '9bed56af30c67e8338c86caed0705dde5126687e0d9c928e90bec19d1539b0a8', '[\"*\"]', '2025-04-08 12:56:01', NULL, '2025-04-08 12:54:30', '2025-04-08 12:56:01'),
(60, 'App\\Models\\User', 'Popi', 'auth-token', 'aa03b5062621fbc13de77fdccf37df1c79bf5b96c11f2d5f15276d5fa7f8f0b1', '[\"*\"]', '2025-04-08 12:58:34', NULL, '2025-04-08 12:56:10', '2025-04-08 12:58:34'),
(61, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'bf394cde99fb8754c6aa788bfdfb9667c3d61efb9a4759a0265fb00cffd14410', '[\"*\"]', '2025-04-11 12:16:41', NULL, '2025-04-08 12:58:43', '2025-04-11 12:16:41'),
(62, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'e922f45b36d41593e990e31c4918967bf76e850f212ee67f683def497f256c5c', '[\"*\"]', '2025-04-11 17:50:48', NULL, '2025-04-11 08:34:19', '2025-04-11 17:50:48'),
(63, 'App\\Models\\User', 'PauGay', 'auth-token', 'dae45595ff832307a39f2d3a8ee43fe8cfcee3d6c387473195469e6ebcd9f38a', '[\"*\"]', '2025-04-11 12:18:42', NULL, '2025-04-11 12:17:29', '2025-04-11 12:18:42'),
(64, 'App\\Models\\User', 'admin', 'auth-token', '9972d5d04eb55580981b92f497994c95463a392576b9fd1d98c3204b8701a1d6', '[\"*\"]', '2025-04-11 15:14:29', NULL, '2025-04-11 12:17:59', '2025-04-11 15:14:29'),
(65, 'App\\Models\\User', 'Albertpv24', 'auth-token', '1de43573b27c307862c2eacd1591624aae70fcc6c2b0226e7998ed34d4a0f78c', '[\"*\"]', '2025-04-11 12:20:12', NULL, '2025-04-11 12:19:41', '2025-04-11 12:20:12'),
(66, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'ed148e190c3d0fae991a290712e06300975011defc7e8c2e3afa81da7fa4cf5d', '[\"*\"]', '2025-04-11 12:33:06', NULL, '2025-04-11 12:20:23', '2025-04-11 12:33:06'),
(67, 'App\\Models\\User', 'Popi', 'auth-token', '80829e53bb790d549534c28a9f2f5ae9cd24a0525991a2dbb567ebf6645e892a', '[\"*\"]', '2025-04-11 12:39:07', NULL, '2025-04-11 12:33:19', '2025-04-11 12:39:07'),
(68, 'App\\Models\\User', 'Popi', 'auth-token', '90bab16f3a010d68a2890a1000e580f80bb863008437468004ac9027bc3afd6e', '[\"*\"]', '2025-04-11 12:41:13', NULL, '2025-04-11 12:39:18', '2025-04-11 12:41:13'),
(69, 'App\\Models\\User', 'Albertpv24', 'auth-token', '1660ad2c5592494f65deb5744f2b025de71f70942efba609a029aee35557d342', '[\"*\"]', '2025-04-11 13:03:18', NULL, '2025-04-11 13:03:11', '2025-04-11 13:03:18'),
(70, 'App\\Models\\User', 'Albertpv24', 'auth-token', '4eedc77ff08da11c95b731e334c7a66ea9d5ba8e4a29fd8e3b21f98aa88b1992', '[\"*\"]', '2025-04-11 14:58:57', NULL, '2025-04-11 14:58:47', '2025-04-11 14:58:57'),
(71, 'App\\Models\\User', 'Popi', 'auth-token', 'f4f527c7a73e80a123796145a74bb1980c4920a1a341bb4877393c2fa1b98008', '[\"*\"]', '2025-04-11 14:59:19', NULL, '2025-04-11 14:59:12', '2025-04-11 14:59:19'),
(72, 'App\\Models\\User', 'admin', 'auth-token', 'fdf73c9c7c14e39c2caeda715f11f28d6ad94b03f13a1110601f0537421d127e', '[\"*\"]', '2025-04-11 18:00:42', NULL, '2025-04-11 17:49:47', '2025-04-11 18:00:42'),
(75, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'aa1994f83cd1d3500f055c0e31e3e4d75a80b93beb5f12879aa45be344811635', '[\"*\"]', '2025-04-13 12:55:54', NULL, '2025-04-13 12:51:59', '2025-04-13 12:55:54'),
(76, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'd898939030c3056456d50fbd8f79bea22e7a49696839951cd9969638a6184960', '[\"*\"]', '2025-04-13 13:14:47', NULL, '2025-04-13 13:02:21', '2025-04-13 13:14:47'),
(77, 'App\\Models\\User', 'admin', 'auth-token', '33f398354c82828157fd077cdebd24af77839e221875381c6f9c1e6d69d40119', '[\"*\"]', '2025-04-13 13:15:01', NULL, '2025-04-13 13:14:57', '2025-04-13 13:15:01'),
(78, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'd0c826fd235c39aa2cda71fafd7d331ea726e54336a0a2dfd55e5e38db746aaf', '[\"*\"]', '2025-04-13 15:46:02', NULL, '2025-04-13 13:15:10', '2025-04-13 15:46:02'),
(79, 'App\\Models\\User', 'admin', 'auth-token', '4ec64704da2f5c23e952521e05daf93d685d3a3ddab80a76320e0aab08a795fa', '[\"*\"]', '2025-04-13 16:03:18', NULL, '2025-04-13 15:46:13', '2025-04-13 16:03:18'),
(80, 'App\\Models\\User', 'Popi', 'auth-token', 'aff5c7a46524b0bd4fdda16eace36833db6456d3d177a5e398c23752ce079809', '[\"*\"]', '2025-04-13 16:12:15', NULL, '2025-04-13 16:03:44', '2025-04-13 16:12:15'),
(81, 'App\\Models\\User', 'admin', 'auth-token', '09654ad64eca7b4869f75f543d4545dbb92716fedafe3771f35fe31b8b27acc1', '[\"*\"]', '2025-04-13 16:25:54', NULL, '2025-04-13 16:04:19', '2025-04-13 16:25:54'),
(82, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'f8524cb60aad072afe768369ee92adb7b6e9779f972f5e327e0f1e4da4df9eec', '[\"*\"]', '2025-04-13 16:28:30', NULL, '2025-04-13 16:12:30', '2025-04-13 16:28:30'),
(83, 'App\\Models\\User', 'admin', 'auth-token', 'f1fc6d6a73bfbcf51ddb70d68a37c03547c360922d9f609f1ac2104fbc55aa12', '[\"*\"]', '2025-04-13 16:27:43', NULL, '2025-04-13 16:26:14', '2025-04-13 16:27:43'),
(84, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'f24b7c30f068030135fa5eb8478e0ae16281e117b2d9a7babef6c2cfa6ff9097', '[\"*\"]', '2025-04-13 16:28:00', NULL, '2025-04-13 16:27:56', '2025-04-13 16:28:00'),
(85, 'App\\Models\\User', 'admin', 'auth-token', '660ab822e9287aa3349ae5b15c94a156739d1253a1f6db201f228cbbe1530197', '[\"*\"]', '2025-04-13 16:39:27', NULL, '2025-04-13 16:28:12', '2025-04-13 16:39:27'),
(86, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'bff2f116abb31c5d34da9094d1e67535397c95fdc7e84afc599c682f07c88228', '[\"*\"]', '2025-04-13 16:30:49', NULL, '2025-04-13 16:28:41', '2025-04-13 16:30:49'),
(87, 'App\\Models\\User', 'Albertpv24', 'auth-token', '9e156cd3eeb01376ed7ad5868b3e0b725272864f929990e805a86d8c9c3f197e', '[\"*\"]', '2025-04-29 09:05:17', NULL, '2025-04-13 16:31:00', '2025-04-29 09:05:17'),
(88, 'App\\Models\\User', 'admin', 'auth-token', '90fec0b7b24e6dfacc641688faeddf94dfd3c9622fdd2f46ef4a32c0950fd3d8', '[\"*\"]', '2025-04-26 07:56:24', NULL, '2025-04-26 07:56:13', '2025-04-26 07:56:24'),
(89, 'App\\Models\\User', 'admin', 'auth-token', '455d20252ad5e27329d917e53a550956ba8f8ea64f39226cc2c4ac1f4f255c1a', '[\"*\"]', '2025-04-26 12:47:49', NULL, '2025-04-26 12:12:11', '2025-04-26 12:47:49'),
(90, 'App\\Models\\User', 'admin', 'auth-token', '1be0c946c29420eb037452ee2ea1eed655edd9ae4cefeddccf443551135317a5', '[\"*\"]', '2025-04-29 09:07:16', NULL, '2025-04-29 08:38:54', '2025-04-29 09:07:16'),
(91, 'App\\Models\\User', 'Albertpv24', 'auth-token', '4b8c37e02bc66ed99c445ed687edbe973e2a0381939187b2eec1e0777a8a54cc', '[\"*\"]', '2025-04-29 09:07:18', NULL, '2025-04-29 09:06:35', '2025-04-29 09:07:18'),
(92, 'App\\Models\\User', 'Popi', 'auth-token', 'f15233332085159e88c3744ecf93ab1b0ad7df7c86d884b6f211780647c1e21e', '[\"*\"]', '2025-04-29 09:07:38', NULL, '2025-04-29 09:07:28', '2025-04-29 09:07:38'),
(93, 'App\\Models\\User', 'Albertpv24', 'auth-token', '62cf079ef38a93330161c4240e2d336d4fae6092443fa7f86a82f09163aef141', '[\"*\"]', '2025-04-29 09:08:00', NULL, '2025-04-29 09:07:46', '2025-04-29 09:08:00'),
(94, 'App\\Models\\User', 'Albertpv24', 'auth-token', '5f29ccdea80f9d15148e68a8ef54c97b3d13bd64a67f11fb0bb141d2f5dbc1ab', '[\"*\"]', '2025-04-30 09:24:31', NULL, '2025-04-30 09:23:09', '2025-04-30 09:24:31'),
(95, 'App\\Models\\User', 'Albertpv24', 'auth-token', '1d24750294904a112418604f18cc8a44f46a308c022fef06a945448dba0d5aad', '[\"*\"]', '2025-05-02 21:35:30', NULL, '2025-05-02 11:27:29', '2025-05-02 21:35:30'),
(96, 'App\\Models\\User', 'Popi', 'auth-token', 'e980076e80097c34946e086c009dcb0f3b5ce1e389bdadd7536ac02f01c0823e', '[\"*\"]', '2025-05-02 22:20:38', NULL, '2025-05-02 21:44:53', '2025-05-02 22:20:38'),
(97, 'App\\Models\\User', 'Albertpv24', 'auth-token', '05dbbae804227500db8a12b6774eb77222b55bd8cf4665ad07a3ff5766045a2e', '[\"*\"]', '2025-05-10 10:20:19', NULL, '2025-05-10 10:19:51', '2025-05-10 10:20:19'),
(98, 'App\\Models\\User', 'Albertpv24', 'auth-token', '58a25a6abc2a05453c228f271d985741f019a712a9b7234fd58b83701c662566', '[\"*\"]', '2025-05-10 10:20:52', NULL, '2025-05-10 10:20:46', '2025-05-10 10:20:52'),
(99, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'df50079bd29e6a98b944fd048fdc039bf5b027cf0f4b7af8da83b5aef83ff20d', '[\"*\"]', '2025-05-10 10:23:01', NULL, '2025-05-10 10:22:55', '2025-05-10 10:23:01'),
(100, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'c86eb56d88defce64d141c46fcb02a7dfc2d28ed1481cd9047053c765d1835a9', '[\"*\"]', '2025-05-10 11:54:42', NULL, '2025-05-10 11:51:37', '2025-05-10 11:54:42'),
(101, 'App\\Models\\User', 'Albertpv24', 'auth-token', '84281b217504d8466cc0ef152d19f0e90d802760133562bb2a4ac31a38bb6aab', '[\"*\"]', '2025-05-10 13:02:07', NULL, '2025-05-10 11:57:54', '2025-05-10 13:02:07'),
(102, 'App\\Models\\User', 'Popi', 'auth-token', 'ad1996da5f06f3ed8cb40d93420fc8ccc1f5c84639ca61c8082ada2a23c38fcd', '[\"*\"]', '2025-05-10 13:08:16', NULL, '2025-05-10 13:08:01', '2025-05-10 13:08:16'),
(103, 'App\\Models\\User', 'admin', 'auth-token', '7ad3636f3a248940e963f547d2a109597f190991f0dad54f49dff3845875940f', '[\"*\"]', '2025-05-13 17:12:04', NULL, '2025-05-10 14:41:51', '2025-05-13 17:12:04'),
(104, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'd1d386d3b8930461e5990a0c8ff642ffce94e3913b792259747193ed472dd6b8', '[\"*\"]', '2025-05-13 17:13:25', NULL, '2025-05-13 17:12:08', '2025-05-13 17:13:25'),
(105, 'App\\Models\\User', 'Albertpv24', 'auth-token', '6bbbc090902ef34049a3192c860abb60d989a0d8a3a3a5342efa45b6da72ef65', '[\"*\"]', '2025-05-13 17:13:44', NULL, '2025-05-13 17:13:35', '2025-05-13 17:13:44'),
(106, 'App\\Models\\User', 'admin', 'auth-token', 'd5c0ce6d557f41e20289210bd8c6412fdff94d00bfb879620475d6f76f60a1d4', '[\"*\"]', '2025-05-13 18:27:56', NULL, '2025-05-13 17:14:36', '2025-05-13 18:27:56'),
(107, 'App\\Models\\User', 'admin', 'auth-token', '5cfc93ae816b1b8a84c350495268b527875da87392a61e77f0dc38e5e15f4d5d', '[\"*\"]', '2025-05-13 18:46:27', NULL, '2025-05-13 18:28:06', '2025-05-13 18:46:27'),
(108, 'App\\Models\\User', 'admin', 'auth-token', '009192746ed0dbcf26c2585dcd9d2347ca83a65a7baba925f1208053405bef00', '[\"*\"]', '2025-05-13 18:49:14', NULL, '2025-05-13 18:48:31', '2025-05-13 18:49:14'),
(109, 'App\\Models\\User', 'admin', 'auth-token', '785e78d04564b161dc9533ede8f0730dd88089090582d1721a4201bd205e8ace', '[\"*\"]', '2025-05-13 18:51:57', NULL, '2025-05-13 18:51:51', '2025-05-13 18:51:57'),
(110, 'App\\Models\\User', 'admin', 'auth-token', '0ebfa946da22f3771a59e70c7f2d7448524b62a4bb791b83884c68a7d869f82d', '[\"*\"]', '2025-05-13 18:54:06', NULL, '2025-05-13 18:53:46', '2025-05-13 18:54:06'),
(111, 'App\\Models\\User', 'admin', 'auth-token', 'e7c61154033608841c5fb22330f25a19fcf4635216b3ad0f292a948031fb9219', '[\"*\"]', '2025-05-13 18:55:34', NULL, '2025-05-13 18:55:26', '2025-05-13 18:55:34'),
(112, 'App\\Models\\User', 'admin', 'auth-token', '51f3eafdf82f9e889e02d1e04d24e0c7e013d46cdbe6cd9075e6c587c5cf8f8a', '[\"*\"]', '2025-05-13 18:59:47', NULL, '2025-05-13 18:59:38', '2025-05-13 18:59:47'),
(113, 'App\\Models\\User', 'admin', 'auth-token', '127a7575624532cc02ed11b3d41a616d2292e98f1730f84ace0791f988dc5221', '[\"*\"]', '2025-05-13 19:02:18', NULL, '2025-05-13 19:02:13', '2025-05-13 19:02:18'),
(114, 'App\\Models\\User', 'admin', 'auth-token', '957aa592ae818b5fea579bd5532e5ceb9c953d51a1276dd7cd1209e251a3a005', '[\"*\"]', '2025-05-13 19:07:23', NULL, '2025-05-13 19:04:18', '2025-05-13 19:07:23'),
(115, 'App\\Models\\User', 'admin', 'auth-token', '137bf681e4a34efd402edf352d949ccf046dc0d12503ef29e68a4d0b47af043d', '[\"*\"]', '2025-05-13 19:07:32', NULL, '2025-05-13 19:07:27', '2025-05-13 19:07:32'),
(116, 'App\\Models\\User', 'admin', 'auth-token', 'da8169363165fb885bebc53966475155b8bb9467adad2d74bd0151ba72bd02ef', '[\"*\"]', '2025-05-13 19:07:38', NULL, '2025-05-13 19:07:34', '2025-05-13 19:07:38'),
(117, 'App\\Models\\User', 'admin', 'auth-token', '660eff770b08072e69890b9d1db81da4c74c41e7b295d100493cc5da8d4d1ed4', '[\"*\"]', '2025-05-13 19:09:09', NULL, '2025-05-13 19:09:03', '2025-05-13 19:09:09'),
(118, 'App\\Models\\User', 'admin', 'auth-token', 'aec67d595eccbf981d76da9b8ea0866545ae36bc7359f9676d8760ed3a67c27c', '[\"*\"]', '2025-05-13 19:09:51', NULL, '2025-05-13 19:09:46', '2025-05-13 19:09:51'),
(119, 'App\\Models\\User', 'admin', 'auth-token', 'f3f14359e1a8bafb9f207cf103ba4c45647a25b57b59a9375cfcaa33c443cbd1', '[\"*\"]', '2025-05-13 19:17:59', NULL, '2025-05-13 19:17:55', '2025-05-13 19:17:59'),
(120, 'App\\Models\\User', 'admin', 'auth-token', 'b16bd87a262804714a8d73fa3ad7c061c55dd72d97248705fe8c7fcfce808223', '[\"*\"]', '2025-05-13 19:18:18', NULL, '2025-05-13 19:18:13', '2025-05-13 19:18:18'),
(121, 'App\\Models\\User', 'admin', 'auth-token', 'eca3584c32cf020f45caab7c7a8c4c6b47ad8f2bdefc04d3fa470f476a888014', '[\"*\"]', '2025-05-13 19:23:59', NULL, '2025-05-13 19:23:55', '2025-05-13 19:23:59'),
(122, 'App\\Models\\User', 'admin', 'auth-token', '608c4edf68d6ed46760ff70c867b60ce8bd368d8cd361ef04744f57474807772', '[\"*\"]', '2025-05-14 08:13:20', NULL, '2025-05-14 07:03:33', '2025-05-14 08:13:20'),
(123, 'App\\Models\\User', 'Popi', 'auth-token', '342ef38faeb8093b0d5c6e858e5ac5e8a21017442fc2fc823c4a93a8e66294f8', '[\"*\"]', '2025-05-14 08:14:00', NULL, '2025-05-14 08:13:32', '2025-05-14 08:14:00'),
(124, 'App\\Models\\User', 'admin', 'auth-token', 'f5069288b5f0ebc05f67744b2511aafc53bf636996bdbaadf7feede189f787ce', '[\"*\"]', '2025-05-14 08:34:09', NULL, '2025-05-14 08:14:21', '2025-05-14 08:34:09'),
(125, 'App\\Models\\User', 'Juan', 'auth-token', 'b3dac568062efd2fcdc3829aee46cbfa935a578c144c1257b231a9e3243b819d', '[\"*\"]', '2025-05-14 08:35:23', NULL, '2025-05-14 08:35:14', '2025-05-14 08:35:23'),
(126, 'App\\Models\\User', 'admin', 'auth-token', 'ad807dbecea76830a157a1099456702408db0941ec6235c123e70d609ee48569', '[\"*\"]', '2025-05-14 08:35:53', NULL, '2025-05-14 08:35:42', '2025-05-14 08:35:53'),
(127, 'App\\Models\\User', 'admin', 'auth-token', '090970d42f8c97a5f1752e371a7baf8dfb4a69754ac282e390761e282bb02ae8', '[\"*\"]', '2025-05-14 08:36:19', NULL, '2025-05-14 08:35:46', '2025-05-14 08:36:19'),
(128, 'App\\Models\\User', 'Laura', 'auth-token', 'a0fbcc1fa6ba5c29e38288f47b17c9d6d412124c45f16cc08999c597d83425b5', '[\"*\"]', '2025-05-14 08:36:55', NULL, '2025-05-14 08:36:31', '2025-05-14 08:36:55'),
(129, 'App\\Models\\User', 'admin', 'auth-token', 'dd35ad427bf10152910492a48b020802096455b8e7c52185b6e985b7721d037f', '[\"*\"]', '2025-05-14 08:37:45', NULL, '2025-05-14 08:37:12', '2025-05-14 08:37:45'),
(130, 'App\\Models\\User', 'admin', 'auth-token', 'f87ea3ba0c7bd8a038915fd59ad9d55be61e464ed58c2277f8c270ff5eaf08c5', '[\"*\"]', '2025-05-14 09:26:49', NULL, '2025-05-14 08:38:16', '2025-05-14 09:26:49');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prediccions_sist`
--

CREATE TABLE `prediccions_sist` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `usuari_nick` varchar(50) DEFAULT NULL,
  `prediccio_proposada_id` bigint(20) UNSIGNED NOT NULL,
  `resultat_prediccio_id` bigint(20) UNSIGNED DEFAULT NULL,
  `punts_apostats` int(11) NOT NULL,
  `validat` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `prediccions_sist`
--

INSERT INTO `prediccions_sist` (`id`, `usuari_nick`, `prediccio_proposada_id`, `resultat_prediccio_id`, `punts_apostats`, `validat`) VALUES
(1, 'Wispy', 2, 1, 1, 1),
(2, 'Albertpv24', 3, 2, 1000, 1),
(4, 'Albertpv24', 4, 4, 10, 1),
(5, 'Wispy', 1, 5, 25, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prediccio_proposada`
--

CREATE TABLE `prediccio_proposada` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `usuari_nick` varchar(50) NOT NULL,
  `cuota` decimal(10,2) NOT NULL,
  `punts_proposats` decimal(10,2) NOT NULL,
  `tipo_apuesta` enum('simple','parlay') NOT NULL DEFAULT 'simple',
  `match_info` varchar(255) DEFAULT NULL,
  `prediction_choice` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `prediccio_proposada`
--

INSERT INTO `prediccio_proposada` (`id`, `usuari_nick`, `cuota`, `punts_proposats`, `tipo_apuesta`, `match_info`, `prediction_choice`) VALUES
(1, 'Wispy', 7.00, 25.00, 'simple', 'UEFA Champions League: Paris Saint Germain vs Aston Villa', NULL),
(2, 'Wispy', 1.40, 1.00, 'simple', 'UEFA Champions League: Barcelona vs Borussia Dortmund', 'Barcelona'),
(3, 'Albertpv24', 45.08, 1000.00, 'parlay', 'La Liga - Spain: Real Madrid vs Leganés + La Liga - Spain: Alavés vs Rayo Vallecano + UEFA Champions League: Barcelona vs Borussia Dortmund', 'Leganés + Alavés + Barcelona'),
(4, 'Albertpv24', 9.66, 10.00, 'parlay', 'La Liga - Spain: Getafe vs Villarreal + La Liga - Spain: Valladolid vs Getafe', 'Villarreal + Valladolid'),
(7, 'Albertpv24', 3.30, 10.00, 'parlay', 'La Liga - Spain: Alavés vs Real Madrid + UEFA Champions League: Bayern München vs Internazionale Milano', 'Real Madrid + Bayern München'),
(10, 'Albertpv24', 2.14, 10.00, 'simple', 'UEFA Champions League: Arsenal vs Paris Saint Germain', 'Arsenal'),
(11, 'Albertpv24', 2.37, 10.00, 'simple', 'La Liga - Spain: Rayo Vallecano vs Getafe', 'Rayo Vallecano'),
(12, 'Albertpv24', 1.83, 10.00, 'simple', 'La Liga - Spain: Barcelona vs Real Madrid', 'Barcelona');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `premis`
--

CREATE TABLE `premis` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `titol` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcio` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cost` decimal(10,2) NOT NULL,
  `condicio` decimal(10,2) NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `premis`
--

INSERT INTO `premis` (`id`, `titol`, `descripcio`, `cost`, `condicio`, `image`) VALUES
(1, 'Tour Per Lleida', 'Visita guiada por los lugares más emblemáticos de Lleida', 1500.00, 1.00, 'uploads/premios/tour.png'),
(2, 'Karting Alpicat', 'Sesión de karting en el circuito de Alpicat', 2000.00, 1.00, 'uploads/premios/karting.png'),
(3, 'Cena Gourmet', 'Cena para dos personas en un restaurante de alta cocina', 3000.00, 1.00, 'uploads/premios/cena.png'),
(4, 'Entradas VIP Lleida Esportiu', 'Dos entradas VIP para un partido del Lleida Esportiu', 1000.00, 1.00, 'uploads/premios/entradas.png'),
(5, 'Partit del Hoops Lleida', 'Entrada para un partido del Hoops Lleida en el Barris Nord', 500.00, 1.00, 'uploads/premios/tour.png'),
(6, 'Escape Room Lleida', 'Experiencia de escape room para ti y tus amigos en Lleida', 2500.00, 1.00, 'uploads/premios/escape.png'),
(7, 'Visita Guiada Museu de Lleida', 'Visita guiada al Museu de Lleida con acceso a todas las exposiciones', 800.00, 1.00, 'uploads/premios/museu.png'),
(8, 'Entrada Camp Nou Experience', 'Visita al estadio del FC Barcelona con el tour completo', 3000.00, 1.00, 'uploads/premios/camp-nou.png'),
(9, 'Visita a la Sagrada Familia', 'Entrada con audioguía para visitar la Sagrada Familia en Barcelona', 2800.00, 1.00, 'uploads/premios/sagrada.png'),
(10, 'Tour por Montserrat', 'Excursión guiada a la montaña de Montserrat con visita al monasterio', 3500.00, 1.00, 'uploads/premios/montserrat.png'),
(11, 'Entrada Partido RCD Espanyol', 'Entrada para un partido del RCD Espanyol en el RCDE Stadium', 10000.00, 1.00, 'uploads/premios/espanyol.png'),
(12, 'Festival Castell de Peralada', 'Entrada para el prestigioso festival de música y danza en el Castell de Peralada', 2200.00, 1.00, 'uploads/premios/peralada.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `premis_traduccions`
--

CREATE TABLE `premis_traduccions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `premi_id` bigint(20) UNSIGNED NOT NULL,
  `idioma_id` int(11) NOT NULL,
  `titol` varchar(255) NOT NULL,
  `descripcio` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `premis_traduccions`
--

INSERT INTO `premis_traduccions` (`id`, `premi_id`, `idioma_id`, `titol`, `descripcio`) VALUES
(1, 3, 4, 'Sopar Gourmet', 'Sopar per a dues persones en un restaurant d\'alta cuina\n'),
(2, 3, 1, 'Cena gourmet', 'Cena para dos personas en un restaurante de alta cocina\n'),
(3, 3, 2, 'Gourmet dinner', 'Dinner for two at a fine dining restaurant'),
(4, 3, 3, 'Cena gourmet', 'Cena per due persone in un ristorante di alta cucina\n'),
(5, 3, 5, 'Dîner gastronomique', 'Dîner pour deux personnes dans un restaurant gastronomique\n'),
(6, 3, 6, 'Gourmet-Abendessen', 'Abendessen für zwei Personen in einem Gourmetrestaurant\n'),
(7, 3, 7, '美食晚餐', '在高档餐厅为两人准备的晚餐'),
(8, 1, 1, 'Tour por Lleida\r\n', 'Visita guiada por los lugares más emblemáticos de Lleida\r\n'),
(9, 1, 2, 'Lleida tour', 'Guided tour of the most iconic places in Lleida\r\n'),
(10, 1, 3, 'Tour per Lleida\r\n', 'Visita guidata dei luoghi più emblematici di Lleida\r\n'),
(11, 1, 4, 'Tour per Lleida\r\n', 'Visita guiada pels llocs més emblemàtics de Lleida\r\n'),
(12, 1, 5, 'Tour à Lleida', 'Visite guidée des lieux les plus emblématiques de Lleida\r\n'),
(13, 1, 6, 'Tour durch Lleida\r\n', 'Geführte Tour zu den berühmtesten Orten in Lleida\n'),
(14, 1, 7, '莱里达之旅', '莱里达最具代表性景点的导览'),
(15, 2, 1, 'Karting Alpicat', 'Sesión de karting en el circuito de Alpicat'),
(16, 2, 2, 'Karting Alpicat', 'Karting session at the Alpicat circuit'),
(17, 2, 3, 'Karting Alpicat', 'Sessione di karting nel circuito di Alpicat'),
(18, 2, 4, 'Karting Alpicat', 'Sessió de karting al circuit d\'Alpicat'),
(19, 2, 5, 'Karting Alpicat', 'Séance de karting sur le circuit d\'Alpicat'),
(20, 2, 6, 'Karting Alpicat', 'Karting-Session auf dem Alpicat-Kurs'),
(21, 2, 7, '卡丁车阿尔皮卡特', '在阿尔皮卡特赛道的卡丁车体验'),
(22, 4, 1, 'Entradas VIP Lleida Esportiu', 'Dos entradas VIP para un partido del Lleida Esportiu'),
(23, 4, 2, 'VIP tickets Lleida Esportiu', 'Two VIP tickets for a Lleida Esportiu match'),
(24, 4, 3, 'Biglietti VIP Lleida Esportiu', 'Due biglietti VIP per una partita del Lleida Esportiu'),
(25, 4, 4, 'Entrades VIP Lleida Esportiu', 'Dues entrades VIP per a un partit del Lleida Esportiu'),
(26, 4, 5, 'Billets VIP Lleida Esportiu', 'Deux billets VIP pour un match du Lleida Esportiu'),
(27, 4, 6, 'VIP-Tickets Lleida Esportiu', 'Zwei VIP-Tickets für ein Spiel des Lleida Esportiu'),
(29, 4, 7, '莱达体育 VIP 票', '两张莱达体育 VIP 票'),
(30, 5, 1, 'Partido del Hoops Lleida', 'Entrada para un partido del Hoops Lleida en el Barris Nord'),
(31, 5, 2, 'Hoops Lleida game', 'Ticket for a Hoops Lleida game at Barris Nord'),
(32, 5, 3, 'Partita degli Hoops Lleida', 'Biglietto per una partita degli Hoops Lleida al Barris Nord'),
(33, 5, 4, 'Partit del Hoops Lleida', 'Entrada per a un partit del Hoops Lleida al Barris Nord'),
(34, 5, 5, 'Match des Hoops Lleida', 'Billet pour un match des Hoops Lleida au Barris Nord'),
(35, 5, 6, 'Spiel der Hoops Lleida', 'Eintritt für ein Spiel der Hoops Lleida im Barris Nord'),
(36, 5, 7, '莱达胡普斯比赛', '在巴里斯诺德观看莱达胡普斯比赛的门票'),
(37, 6, 1, 'Escape Room Lleida', 'Experiencia de escape room para ti y tus amigos en Lleida'),
(38, 6, 2, 'Escape Room Lleida', 'Escape room experience for you and your friends in Lleida'),
(39, 6, 3, 'Escape Room Lleida', 'Esperienza di escape room per te e i tuoi amici a Lleida'),
(40, 6, 4, 'Escape Room Lleida', 'Experiència d\'escape room per a tu i els teus amics a Lleida'),
(41, 6, 5, 'Escape Room Lleida', 'Expérience d\'escape room pour toi et tes amis à Lleida'),
(42, 6, 6, 'Escape Room Lleida', 'Escape Room-Erlebnis für dich und deine Freunde in Lleida'),
(43, 6, 7, '莱达密室逃脱', '在莱达为你和你的朋友提供的密室逃脱体验'),
(44, 7, 1, 'Visita Guiada Museu de Lleida', 'Visita guiada al Museu de Lleida con acceso a todas las exposiciones'),
(45, 7, 2, 'Guided Tour Museu de Lleida', 'Guided tour of the Museu de Lleida with access to all exhibitions'),
(46, 7, 3, 'Visita Guidata Museu de Lleida', 'Visita guidata al Museu de Lleida con accesso a tutte le esposizioni'),
(47, 7, 4, 'Visita Guiada Museu de Lleida', 'Visita guiada al Museu de Lleida amb accés a totes les exposicions'),
(49, 7, 5, 'Visite Guidée Museu de Lleida', 'Visite guidée du Museu de Lleida avec accès à toutes les expositions'),
(50, 7, 6, 'Geführte Tour Museu de Lleida', 'Geführte Tour durch das Museu de Lleida mit Zugang zu allen Ausstellungen'),
(51, 7, 7, '莱里达博物馆导览', '含全部展览参观权的莱里达博物馆导览'),
(52, 8, 1, 'Entrada Camp Nou Experience', 'Visita al estadio del FC Barcelona con el tour completo'),
(53, 8, 2, 'Camp Nou Experience Ticket', 'Visit to FC Barcelona\'s stadium with the full tour'),
(54, 8, 3, 'Biglietto Camp Nou Experience', 'Visita allo stadio del FC Barcelona con il tour completo'),
(55, 8, 4, 'Entrada Camp Nou Experience', 'Visita a l\'estadi del FC Barcelona amb el tour complet'),
(56, 8, 5, 'Billet Camp Nou Experience', 'Visite du stade du FC Barcelone avec le tour complet'),
(57, 8, 6, 'Eintrittskarte für die Camp Nou Experience', 'Besuch des Stadions des FC Barcelona mit kompletter Tour'),
(58, 8, 7, '诺坎普体验门票', '参观巴塞罗那足球俱乐部球场（全程导览）'),
(59, 9, 1, 'Visita a la Sagrada Familia', 'Entrada con audioguía para visitar la Sagrada Familia en Barcelona'),
(60, 9, 2, 'Visit to the Sagrada Familia', 'Ticket with audio guide to visit the Sagrada Familia in Barcelona'),
(61, 9, 3, 'Visita alla Sagrada Familia', 'Biglietto con audioguida per visitare la Sagrada Familia a Barcellona'),
(62, 9, 4, 'Visita a la Sagrada Família', 'Entrada amb audioguia per visitar la Sagrada Família a Barcelona'),
(63, 9, 5, 'Visite de la Sagrada Familia', 'Billet avec audioguide pour visiter la Sagrada Familia à Barcelone'),
(64, 9, 6, 'Besuch der Sagrada Familia', 'Eintrittskarte mit Audioguide für den Besuch der Sagrada Familia in Barcelona'),
(65, 9, 7, '参观圣家堂', '含语音导览的圣家堂巴塞罗那参观门票'),
(66, 10, 1, 'Tour por Montserrat', 'Excursión guiada a la montaña de Montserrat con visita al monasterio'),
(67, 10, 2, 'Tour of Montserrat', 'Guided excursion to Montserrat mountain with a visit to the monastery'),
(68, 10, 3, 'Tour di Montserrat', 'Escursione guidata alla montagna di Montserrat con visita al monastero'),
(69, 10, 4, 'Visita a Montserrat', 'Excursió guiada a la muntanya de Montserrat amb visita al monestir'),
(70, 10, 5, 'Visite de Montserrat', 'Excursion guidée à la montagne de Montserrat avec visite du monastère'),
(71, 10, 6, 'Tour durch Montserrat', 'Geführter Ausflug zum Berg Montserrat mit Besuch des Klosters'),
(72, 10, 7, '蒙特塞拉特之旅', '蒙特塞拉特山导览之旅，含修道院参观'),
(73, 11, 1, 'Entrada Partido RCD Espanyol', 'Entrada para un partido del RCD Espanyol en el RCDE Stadium\n\n'),
(74, 11, 2, 'RCD Espanyol Match Ticket', 'Ticket for an RCD Espanyol match at the RCDE Stadium'),
(75, 11, 3, 'Biglietto per la partita dell\'RCD Espanyol', 'Biglietto per una partita dell\'RCD Espanyol allo RCDE Stadium'),
(76, 11, 4, 'Entrada partit RCD Espanyol', 'Entrada per un partit del RCD Espanyol al RCDE Stadium'),
(77, 11, 5, 'Billet pour le match de RCD Espanyol', 'Billet pour un match de l\'RCD Espanyol au RCDE Stadium'),
(78, 11, 6, 'Eintrittskarte für das Spiel von RCD Espanyol', 'Eintrittskarte für ein Spiel des RCD Espanyol im RCDE Stadium'),
(79, 11, 7, '皇家西班牙人俱乐部比赛门票', '皇家西班牙人俱乐部比赛门票（RCDE 体育场）'),
(80, 12, 1, 'Festival Castell de Peralada', 'Entrada para el prestigioso festival de música y danza en el Castell de Peralada'),
(81, 12, 2, 'Castell de Peralada Festival', 'Ticket for the prestigious music and dance festival at the Castell de Peralada'),
(82, 12, 3, 'Festival Castell de Peralada', 'Biglietto per il prestigioso festival di musica e danza al Castell de Peralada'),
(83, 12, 4, 'Festival Castell de Peralada', 'Entrada per al prestigiós festival de música i dansa al Castell de Peralada'),
(84, 12, 5, 'Festival Castell de Peralada', 'Billet pour le prestigieux festival de musique et de danse au Castell de Peralada'),
(85, 12, 6, 'Festival Castell de Peralada', 'Eintrittskarte für das prestigeträchtige Musik- und Tanzfestival im Castell de Peralada'),
(86, 12, 7, '佩拉拉城堡音乐节', '佩拉拉城堡音乐与舞蹈盛典门票');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `premis_usuaris`
--

CREATE TABLE `premis_usuaris` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `usuari_nick` varchar(50) NOT NULL,
  `premi_id` bigint(20) UNSIGNED NOT NULL,
  `data_reclamat` timestamp NOT NULL DEFAULT current_timestamp(),
  `data_limit` datetime GENERATED ALWAYS AS (`data_reclamat` + interval 1 month) STORED,
  `usat` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `premis_usuaris`
--

INSERT INTO `premis_usuaris` (`id`, `usuari_nick`, `premi_id`, `data_reclamat`, `usat`) VALUES
(1, 'Albertpv24', 1, '2025-03-21 09:02:30', 1),
(2, 'Albertpv24', 2, '2025-03-21 09:02:40', 0),
(4, 'Albertpv24', 4, '2025-04-10 12:17:01', 0),
(5, 'Albertpv24', 4, '2025-04-10 12:17:14', 0),
(6, 'Albertpv24', 3, '2025-04-10 15:11:19', 0),
(7, 'Albertpv24', 3, '2025-04-10 15:11:51', 0),
(8, 'Albertpv24', 3, '2025-04-10 15:15:55', 0),
(9, 'Albertpv24', 3, '2025-04-10 15:19:39', 0),
(10, 'Albertpv24', 3, '2025-04-10 15:23:31', 0),
(11, 'Albertpv24', 4, '2025-04-13 13:02:33', 0),
(12, 'Albertpv24', 4, '2025-04-13 13:02:39', 0),
(13, 'Albertpv24', 2, '2025-04-13 13:02:43', 0),
(14, 'Albertpv24', 2, '2025-04-13 13:02:49', 0),
(15, 'Albertpv24', 4, '2025-04-13 14:52:00', 0),
(16, 'Albertpv24', 1, '2025-04-13 14:52:06', 1),
(18, 'Albertpv24', 4, '2025-05-10 11:53:47', 0),
(19, 'Albertpv24', 2, '2025-05-10 11:54:06', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `promociones_users`
--

CREATE TABLE `promociones_users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `promocion_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `promos`
--

CREATE TABLE `promos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `titol` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcio` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_inici` date NOT NULL,
  `data_final` date NOT NULL,
  `tipus_promocio` bigint(20) UNSIGNED DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `promos`
--

INSERT INTO `promos` (`id`, `titol`, `descripcio`, `data_inici`, `data_final`, `tipus_promocio`, `image`) VALUES
(1, 'Bono de Bienvenida', 'Recibe 500 puntos al registrarte', '2023-01-01', '2025-12-31', 1, 'uploads/promociones/bienvenida.png'),
(2, 'Apuesta Segura', 'Recupera tu apuesta si pierdes en tu primera predicción', '2023-06-01', '2024-12-31', 1, 'uploads/promociones/apuesta-segura.png'),
(3, 'Copa del Rey 2024', 'Duplica tus puntos en apuestas para la Copa del Rey', '2024-01-01', '2024-04-30', 3, 'uploads/promociones/copa-rey.png'),
(4, 'Liga 2023-2024', 'Gana puntos extra por cada 5 predicciones acertadas en La Liga', '2023-08-01', '2024-05-31', 2, 'uploads/promociones/liga.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `promos_traduccions`
--

CREATE TABLE `promos_traduccions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `promo_id` bigint(20) UNSIGNED NOT NULL,
  `idioma_id` int(11) NOT NULL,
  `titol` varchar(255) NOT NULL,
  `descripcio` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resultat_prediccio`
--

CREATE TABLE `resultat_prediccio` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `resultat_prediccio` enum('Guanyat','Perdut','Empat') DEFAULT NULL,
  `validacio` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `resultat_prediccio`
--

INSERT INTO `resultat_prediccio` (`id`, `resultat_prediccio`, `validacio`) VALUES
(1, 'Guanyat', 'Verificado por administrador'),
(2, 'Guanyat', 'Verificado por administrador'),
(3, 'Guanyat', 'Verificado por administrador'),
(4, 'Guanyat', 'Verificado por administrador'),
(5, 'Guanyat', 'Verificado por administrador'),
(6, 'Guanyat', 'Verificado por administrador'),
(7, 'Perdut', 'Verificado por administrador'),
(8, 'Guanyat', 'Verificado por administrador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipus_promocio`
--

CREATE TABLE `tipus_promocio` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `titol` varchar(255) NOT NULL,
  `descripcio` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tipus_promocio`
--

INSERT INTO `tipus_promocio` (`id`, `titol`, `descripcio`) VALUES
(1, 'Bienvenida', 'Promociones para nuevos usuarios'),
(2, 'Temporada', 'Promociones por temporada deportiva'),
(3, 'Evento Especial', 'Promociones para eventos deportivos especiales');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_sist`
--

CREATE TABLE `user_sist` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nick` varchar(50) NOT NULL,
  `pswd` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuaris`
--

CREATE TABLE `usuaris` (
  `nick` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `tipus_acc` enum('Usuari','Usuari_premium','Administrador') NOT NULL,
  `pswd` varchar(255) NOT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `saldo` decimal(10,2) NOT NULL DEFAULT 0.00,
  `creat_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualitzat_el` date DEFAULT NULL,
  `apostes_realitzades` int(11) NOT NULL DEFAULT 0,
  `temps_diari` int(11) NOT NULL DEFAULT 3600,
  `bloquejat` tinyint(1) NOT NULL DEFAULT 0,
  `dni` varchar(9) NOT NULL,
  `telefon` varchar(15) DEFAULT NULL,
  `data_naixement` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuaris`
--

INSERT INTO `usuaris` (`nick`, `email`, `tipus_acc`, `pswd`, `profile_image`, `saldo`, `creat_at`, `actualitzat_el`, `apostes_realitzades`, `temps_diari`, `bloquejat`, `dni`, `telefon`, `data_naixement`) VALUES
('admin', 'admin@admin.com', 'Administrador', '$2y$12$Z/YcfH1M3uHsmFh4pAgs1Oak.8TyilxKpdRDHRrq2vYOyVxd8/41a', NULL, 0.00, '2025-03-18 19:40:11', NULL, 0, 3600, 0, '', NULL, '2025-03-18'),
('Albertpv24', 'albertpv24@gmail.com', 'Usuari', '$2y$12$C8mLq6F7Ukw8RQgZZk1R0uGcX.I.Vvu89oHJ.xxOU8kHyBM6AALLG', 'uploads/profiles/profile_1742315811_67d9a12336465.png', 10016576.60, '2025-03-18 16:36:51', NULL, 0, 3600, 0, '48052260Q', '645554144', '2003-04-24'),
('Juan', 'juan@gmail.com', 'Usuari', '$2y$12$/m9CnTCkPkyXjdZL15CG..X7TAeirP15Ot90IBe6sMGXqpO/ihXeW', 'uploads/profiles/profile_1747218904_682471d8061f1.png', 0.00, '2025-05-14 10:35:04', NULL, 0, 3600, 0, '54637281A', '278394567', '2000-01-01'),
('Laura', 'laura@gmail.com', 'Usuari', '$2y$12$EMP1P06sII/gweZTuL6.qu4us8le4SEsxtsoO24o/9M3LZeu/vi.S', NULL, 100000.00, '2025-05-14 10:32:53', NULL, 0, 3600, 0, '98723456D', '123456787', '2000-01-01'),
('Popi', 'a@a.com', 'Usuari', '$2y$12$EApYi6YQh4muegSDO.5GQeh4zb0LOQjxagXS/LDEjenN2TFwCiCV2', NULL, 1000.00, '2025-05-14 10:26:22', NULL, 0, 3600, 0, '56748938B', '978675642', '2001-01-01'),
('Wispy', 'paudomec@alumnes.ilerna.com', 'Usuari', '$2y$12$iVGmPHaf.eyGoThYf99u1u4iA3xVcDDa1Gj7gc7WJHrQJ7.2ANdOu', 'uploads/profiles/profile_1742315104_67d99e60222b0.png', 197.40, '2025-03-18 16:25:04', NULL, 0, 3600, 0, '48059629W', '611411604', '2004-11-30');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `apuestas`
--
ALTER TABLE `apuestas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `apuestas_user_id_foreign` (`user_id`);

--
-- Indices de la tabla `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_messages_user_id_foreign` (`user_id`),
  ADD KEY `chat_messages_admin_id_foreign` (`admin_id`),
  ADD KEY `chat_messages_chat_session_id_foreign` (`chat_session_id`);

--
-- Indices de la tabla `chat_sessions`
--
ALTER TABLE `chat_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `chat_sessions_session_id_unique` (`session_id`),
  ADD KEY `chat_sessions_user_id_foreign` (`user_id`),
  ADD KEY `chat_sessions_admin_id_foreign` (`admin_id`);

--
-- Indices de la tabla `daily_rewards_tracking`
--
ALTER TABLE `daily_rewards_tracking`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `daily_rewards_tracking_usuari_nick_date_unique` (`usuari_nick`,`date`);

--
-- Indices de la tabla `detalle_prediccio`
--
ALTER TABLE `detalle_prediccio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `detalle_prediccio_prediccio_proposada_id_foreign` (`prediccio_proposada_id`);

--
-- Indices de la tabla `idiomas`
--
ALTER TABLE `idiomas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo_iso` (`codigo_iso`);

--
-- Indices de la tabla `inscripcio_a_promos`
--
ALTER TABLE `inscripcio_a_promos`
  ADD PRIMARY KEY (`usuari_nick`,`promo_id`),
  ADD KEY `inscripcio_a_promos_promo_id_foreign` (`promo_id`);

--
-- Indices de la tabla `limitacio`
--
ALTER TABLE `limitacio`
  ADD PRIMARY KEY (`usuari_nick`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indices de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indices de la tabla `prediccions_sist`
--
ALTER TABLE `prediccions_sist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `prediccions_sist_prediccio_proposada_id_foreign` (`prediccio_proposada_id`),
  ADD KEY `prediccions_sist_resultat_prediccio_id_foreign` (`resultat_prediccio_id`),
  ADD KEY `prediccions_sist_usuari_nick_foreign` (`usuari_nick`);

--
-- Indices de la tabla `prediccio_proposada`
--
ALTER TABLE `prediccio_proposada`
  ADD PRIMARY KEY (`id`),
  ADD KEY `prediccio_proposada_usuari_nick_foreign` (`usuari_nick`);

--
-- Indices de la tabla `premis`
--
ALTER TABLE `premis`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `premis_traduccions`
--
ALTER TABLE `premis_traduccions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `premi_idioma_unique` (`premi_id`,`idioma_id`),
  ADD KEY `idioma_id` (`idioma_id`);

--
-- Indices de la tabla `premis_usuaris`
--
ALTER TABLE `premis_usuaris`
  ADD PRIMARY KEY (`id`),
  ADD KEY `premis_usuaris_premi_id_foreign` (`premi_id`),
  ADD KEY `premis_usuaris_usuari_nick_foreign` (`usuari_nick`);

--
-- Indices de la tabla `promociones_users`
--
ALTER TABLE `promociones_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `promociones_users_user_id_foreign` (`user_id`);

--
-- Indices de la tabla `promos`
--
ALTER TABLE `promos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `promos_tipus_promocio_foreign` (`tipus_promocio`);

--
-- Indices de la tabla `promos_traduccions`
--
ALTER TABLE `promos_traduccions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `promo_idioma_unique` (`promo_id`,`idioma_id`),
  ADD KEY `idioma_id` (`idioma_id`);

--
-- Indices de la tabla `resultat_prediccio`
--
ALTER TABLE `resultat_prediccio`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tipus_promocio`
--
ALTER TABLE `tipus_promocio`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `user_sist`
--
ALTER TABLE `user_sist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_sist_nick_unique` (`nick`);

--
-- Indices de la tabla `usuaris`
--
ALTER TABLE `usuaris`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `usuaris_email_unique` (`email`),
  ADD UNIQUE KEY `usuaris_dni_unique` (`dni`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `apuestas`
--
ALTER TABLE `apuestas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT de la tabla `chat_sessions`
--
ALTER TABLE `chat_sessions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `daily_rewards_tracking`
--
ALTER TABLE `daily_rewards_tracking`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT de la tabla `detalle_prediccio`
--
ALTER TABLE `detalle_prediccio`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `idiomas`
--
ALTER TABLE `idiomas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;

--
-- AUTO_INCREMENT de la tabla `prediccions_sist`
--
ALTER TABLE `prediccions_sist`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `prediccio_proposada`
--
ALTER TABLE `prediccio_proposada`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `premis`
--
ALTER TABLE `premis`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `premis_traduccions`
--
ALTER TABLE `premis_traduccions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT de la tabla `premis_usuaris`
--
ALTER TABLE `premis_usuaris`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `promociones_users`
--
ALTER TABLE `promociones_users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `promos`
--
ALTER TABLE `promos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `promos_traduccions`
--
ALTER TABLE `promos_traduccions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `resultat_prediccio`
--
ALTER TABLE `resultat_prediccio`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `tipus_promocio`
--
ALTER TABLE `tipus_promocio`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `user_sist`
--
ALTER TABLE `user_sist`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `apuestas`
--
ALTER TABLE `apuestas`
  ADD CONSTRAINT `apuestas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuaris` (`nick`) ON DELETE CASCADE;

--
-- Filtros para la tabla `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `usuaris` (`nick`),
  ADD CONSTRAINT `chat_messages_chat_session_id_foreign` FOREIGN KEY (`chat_session_id`) REFERENCES `chat_sessions` (`session_id`),
  ADD CONSTRAINT `chat_messages_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuaris` (`nick`) ON DELETE CASCADE;

--
-- Filtros para la tabla `chat_sessions`
--
ALTER TABLE `chat_sessions`
  ADD CONSTRAINT `chat_sessions_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `usuaris` (`nick`),
  ADD CONSTRAINT `chat_sessions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuaris` (`nick`);

--
-- Filtros para la tabla `daily_rewards_tracking`
--
ALTER TABLE `daily_rewards_tracking`
  ADD CONSTRAINT `daily_rewards_tracking_usuari_nick_foreign` FOREIGN KEY (`usuari_nick`) REFERENCES `usuaris` (`nick`) ON DELETE CASCADE;

--
-- Filtros para la tabla `detalle_prediccio`
--
ALTER TABLE `detalle_prediccio`
  ADD CONSTRAINT `detalle_prediccio_prediccio_proposada_id_foreign` FOREIGN KEY (`prediccio_proposada_id`) REFERENCES `prediccio_proposada` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `inscripcio_a_promos`
--
ALTER TABLE `inscripcio_a_promos`
  ADD CONSTRAINT `inscripcio_a_promos_promo_id_foreign` FOREIGN KEY (`promo_id`) REFERENCES `promos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inscripcio_a_promos_usuari_nick_foreign` FOREIGN KEY (`usuari_nick`) REFERENCES `usuaris` (`nick`) ON DELETE CASCADE;

--
-- Filtros para la tabla `limitacio`
--
ALTER TABLE `limitacio`
  ADD CONSTRAINT `limitacio_usuari_nick_foreign` FOREIGN KEY (`usuari_nick`) REFERENCES `usuaris` (`nick`) ON DELETE CASCADE;

--
-- Filtros para la tabla `prediccions_sist`
--
ALTER TABLE `prediccions_sist`
  ADD CONSTRAINT `prediccions_sist_prediccio_proposada_id_foreign` FOREIGN KEY (`prediccio_proposada_id`) REFERENCES `prediccio_proposada` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `prediccions_sist_resultat_prediccio_id_foreign` FOREIGN KEY (`resultat_prediccio_id`) REFERENCES `resultat_prediccio` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `prediccions_sist_usuari_nick_foreign` FOREIGN KEY (`usuari_nick`) REFERENCES `usuaris` (`nick`) ON DELETE SET NULL;

--
-- Filtros para la tabla `prediccio_proposada`
--
ALTER TABLE `prediccio_proposada`
  ADD CONSTRAINT `prediccio_proposada_usuari_nick_foreign` FOREIGN KEY (`usuari_nick`) REFERENCES `usuaris` (`nick`) ON DELETE CASCADE;

--
-- Filtros para la tabla `premis_traduccions`
--
ALTER TABLE `premis_traduccions`
  ADD CONSTRAINT `premis_traduccions_idioma_id_foreign` FOREIGN KEY (`idioma_id`) REFERENCES `idiomas` (`id`),
  ADD CONSTRAINT `premis_traduccions_premi_id_foreign` FOREIGN KEY (`premi_id`) REFERENCES `premis` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `premis_usuaris`
--
ALTER TABLE `premis_usuaris`
  ADD CONSTRAINT `premis_usuaris_premi_id_foreign` FOREIGN KEY (`premi_id`) REFERENCES `premis` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `premis_usuaris_usuari_nick_foreign` FOREIGN KEY (`usuari_nick`) REFERENCES `usuaris` (`nick`) ON DELETE CASCADE;

--
-- Filtros para la tabla `promociones_users`
--
ALTER TABLE `promociones_users`
  ADD CONSTRAINT `promociones_users_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuaris` (`nick`) ON DELETE CASCADE;

--
-- Filtros para la tabla `promos`
--
ALTER TABLE `promos`
  ADD CONSTRAINT `promos_tipus_promocio_foreign` FOREIGN KEY (`tipus_promocio`) REFERENCES `tipus_promocio` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `promos_traduccions`
--
ALTER TABLE `promos_traduccions`
  ADD CONSTRAINT `promos_traduccions_idioma_id_foreign` FOREIGN KEY (`idioma_id`) REFERENCES `idiomas` (`id`),
  ADD CONSTRAINT `promos_traduccions_promo_id_foreign` FOREIGN KEY (`promo_id`) REFERENCES `promos` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
