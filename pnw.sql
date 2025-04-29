-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-04-2025 a las 15:31:42
-- Versión del servidor: 10.4.25-MariaDB
-- Versión de PHP: 8.1.10

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
-- Estructura de tabla para la tabla `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `read` tinyint(1) NOT NULL DEFAULT 0,
  `chat_session_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
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
(54, 'Popi', NULL, '¡Hola! Necesito ayuda.', 0, 0, '5e2fcb1d-7872-473d-812d-315186116557', '2025-04-11 12:33:23', '2025-04-11 12:33:23'),
(55, 'Popi', NULL, 'Hello! I need help.', 0, 0, '203687ed-15d3-41d4-8043-b79704ffed98', '2025-04-11 12:39:25', '2025-04-11 12:39:25'),
(56, 'Albertpv24', NULL, '¡Hola! Necesito ayuda.', 0, 0, '3f4a7c2c-7479-4034-ac06-1edf97255043', '2025-04-11 14:58:52', '2025-04-11 14:58:52'),
(57, 'Popi', NULL, 'Hello! I need help.', 0, 0, 'a09d37c4-09de-45aa-a03b-27f90728ac4f', '2025-04-11 14:59:16', '2025-04-11 14:59:16'),
(58, 'Albertpv24', NULL, 'Ciao! Ho bisogno di aiuto.', 0, 0, '9f3c8730-b5ab-47ef-9046-3caf876825aa', '2025-04-22 11:42:52', '2025-04-22 11:42:52'),
(59, 'Albertpv24', NULL, '¡Hola! Necesito ayuda.', 0, 0, 'df6a4496-c048-4d16-993d-eeea43e2ff21', '2025-04-25 15:15:56', '2025-04-25 15:15:56');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chat_sessions`
--

CREATE TABLE `chat_sessions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `session_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_message` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
(23, '5e2fcb1d-7872-473d-812d-315186116557', 'Popi', 'admin', '¡Hola! Necesito ayuda.', '2025-04-11 12:33:23', 1, '2025-04-11 12:33:23', '2025-04-11 12:33:23'),
(24, '203687ed-15d3-41d4-8043-b79704ffed98', 'Popi', 'admin', 'Hello! I need help.', '2025-04-11 12:39:25', 1, '2025-04-11 12:39:25', '2025-04-11 12:39:25'),
(25, '3f4a7c2c-7479-4034-ac06-1edf97255043', 'Albertpv24', 'admin', '¡Hola! Necesito ayuda.', '2025-04-11 14:58:52', 1, '2025-04-11 14:58:52', '2025-04-11 14:58:52'),
(26, 'a09d37c4-09de-45aa-a03b-27f90728ac4f', 'Popi', 'admin', 'Hello! I need help.', '2025-04-11 14:59:16', 1, '2025-04-11 14:59:16', '2025-04-11 14:59:16'),
(27, '9f3c8730-b5ab-47ef-9046-3caf876825aa', 'Albertpv24', 'admin', 'Ciao! Ho bisogno di aiuto.', '2025-04-22 11:42:52', 1, '2025-04-22 11:42:52', '2025-04-22 11:42:52'),
(28, 'df6a4496-c048-4d16-993d-eeea43e2ff21', 'Albertpv24', 'admin', '¡Hola! Necesito ayuda.', '2025-04-25 15:15:56', 1, '2025-04-25 15:15:56', '2025-04-25 15:15:56');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `daily_rewards_tracking`
--

CREATE TABLE `daily_rewards_tracking` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `usuari_nick` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
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
(9, 'Laura', '2025-04-06', 1, 100, 0, 0, 0, 5, 0, 3600, '2025-04-06 18:07:37', '2025-04-06 18:07:37'),
(10, 'Albertpv24', '2025-04-07', 1, 200, 0, 0, 0, 5, 0, 3600, '2025-04-07 11:39:25', '2025-04-07 11:39:25'),
(11, 'Albertpv24', '2025-04-08', 1, 75, 1, 30, 0, 5, 0, 3600, '2025-04-08 12:32:58', '2025-04-08 12:47:33'),
(12, 'Popi', '2025-04-08', 1, 500, 0, 0, 0, 5, 0, 3600, '2025-04-08 12:56:17', '2025-04-08 12:56:22'),
(13, 'Albertpv24', '2025-04-10', 1, 10, 0, 0, 0, 5, 0, 3600, '2025-04-10 12:11:56', '2025-04-10 12:11:56'),
(14, 'Albertpv24', '2025-04-11', 1, 25, 0, 0, 0, 5, 0, 3600, '2025-04-11 11:34:33', '2025-04-11 11:34:33'),
(16, 'Albertpv24', '2025-04-22', 1, 150, 0, 0, 1, 1, 60, 60, '2025-04-22 11:35:41', '2025-04-22 12:37:22'),
(17, 'Popi', '2025-04-22', 0, 0, 0, 0, 2, 2, 120, 3600, '2025-04-22 12:28:10', '2025-04-22 12:28:39'),
(18, 'Wispy', '2025-04-22', 0, 0, 0, 0, 2, 5, 120, 3600, '2025-04-22 12:29:25', '2025-04-22 12:31:06'),
(19, 'Albertpv24', '2025-04-25', 1, 25, 0, 0, 0, 4, 1154, 3600, '2025-04-25 12:54:17', '2025-04-25 15:52:58'),
(20, 'Popi', '2025-04-25', 0, 0, 0, 0, 1, 4, 3123, 3600, '2025-04-25 13:14:49', '2025-04-25 15:03:10'),
(21, 'Kakanata', '2025-04-25', 0, 0, 0, 0, 0, 4, 0, 3600, '2025-04-25 15:02:58', '2025-04-25 15:03:10'),
(22, 'Laura', '2025-04-25', 0, 0, 0, 0, 0, 4, 0, 3600, '2025-04-25 15:02:58', '2025-04-25 15:03:10'),
(23, 'Wispy', '2025-04-25', 0, 0, 0, 0, 0, 4, 60, 60, '2025-04-25 15:02:58', '2025-04-25 15:31:27'),
(24, 'Albertpv24', '2025-04-29', 0, 0, 0, 0, 0, 5, 0, 3600, '2025-04-29 11:29:17', '2025-04-29 11:29:17');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_prediccio`
--

CREATE TABLE `detalle_prediccio` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `prediccio_proposada_id` bigint(20) UNSIGNED NOT NULL,
  `match_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `equipo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_apuesta` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cuota` decimal(10,2) NOT NULL,
  `match_info` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `detalle_prediccio`
--

INSERT INTO `detalle_prediccio` (`id`, `prediccio_proposada_id`, `match_id`, `equipo`, `tipo_apuesta`, `cuota`, `match_info`, `created_at`, `updated_at`) VALUES
(1, 1, '7870be3e8c8ac05798da0a844571f6f7', 'Aston Villa', 'h2h', '7.00', 'UEFA Champions League: Paris Saint Germain vs Aston Villa', '2025-03-18 15:25:38', '2025-03-18 15:25:38'),
(2, 2, '2162b24f54d968d430da71037503dfcc', 'Barcelona', 'h2h', '1.40', 'UEFA Champions League: Barcelona vs Borussia Dortmund', '2025-03-18 15:27:19', '2025-03-18 15:27:19'),
(3, 3, '669cb87a46c56ab00d788ec520481b3a', 'Leganés', 'h2h', '14.00', 'La Liga - Spain: Real Madrid vs Leganés', '2025-03-20 21:55:17', '2025-03-20 21:55:17'),
(4, 3, 'de1a04fc86dc062151afe5c98a96258a', 'Alavés', 'h2h', '2.30', 'La Liga - Spain: Alavés vs Rayo Vallecano', '2025-03-20 21:55:17', '2025-03-20 21:55:17'),
(5, 3, '2162b24f54d968d430da71037503dfcc', 'Barcelona', 'h2h', '1.40', 'UEFA Champions League: Barcelona vs Borussia Dortmund', '2025-03-20 21:55:17', '2025-03-20 21:55:17'),
(6, 4, '268e4818f0941be692b1496fdf70dee4', 'Villarreal', 'h2h', '2.30', 'La Liga - Spain: Getafe vs Villarreal', '2025-03-21 09:03:42', '2025-03-21 09:03:42'),
(7, 4, '3eac51545c1860f07789ca6be6464e58', 'Valladolid', 'h2h', '4.20', 'La Liga - Spain: Valladolid vs Getafe', '2025-03-21 09:03:42', '2025-03-21 09:03:42'),
(11, 6, '09b2fe5e35e1c47aab13f282ecd01060', 'Empate', 'h2h', '2.50', 'La Liga - Spain: Villarreal vs Athletic Bilbao', '2025-04-06 18:09:27', '2025-04-06 18:09:27'),
(12, 6, '00ae27af9b19dfb4b023588de87d0087', 'Empate', 'h2h', '3.70', 'La Liga - Spain: Celta Vigo vs Espanyol', '2025-04-06 18:09:27', '2025-04-06 18:09:27'),
(13, 7, 'c250cd9784712b609000f9af50a0ba04', 'Real Madrid', 'h2h', '1.62', 'La Liga - Spain: Alavés vs Real Madrid', '2025-04-08 13:56:50', '2025-04-08 13:56:50'),
(14, 7, '1ad1f20f8b22abf90405d038b86a49f2', 'Bayern München', 'h2h', '2.04', 'UEFA Champions League: Bayern München vs Internazionale Milano', '2025-04-08 13:56:50', '2025-04-08 13:56:50'),
(17, 9, 'fdfe02bccad6f804d66852927a21a96f', 'Barcelona', 'h2h', '1.68', 'UEFA Champions League: Barcelona vs Internazionale Milano', '2025-04-22 12:24:48', '2025-04-22 12:24:48'),
(18, 9, '8d5af0f27f5f71819ccd71affe8dc0cb', 'Empate', 'h2h', '3.48', 'UEFA Champions League: Arsenal vs Paris Saint Germain', '2025-04-22 12:24:48', '2025-04-22 12:24:48'),
(19, 10, 'fdfe02bccad6f804d66852927a21a96f', 'Barcelona', 'h2h', '1.68', 'UEFA Champions League: Barcelona vs Internazionale Milano', '2025-04-22 12:28:16', '2025-04-22 12:28:16'),
(20, 11, 'fdfe02bccad6f804d66852927a21a96f', 'Barcelona', 'h2h', '1.68', 'UEFA Champions League: Barcelona vs Internazionale Milano', '2025-04-22 12:28:39', '2025-04-22 12:28:39'),
(21, 12, '8d5af0f27f5f71819ccd71affe8dc0cb', 'Arsenal', 'h2h', '2.14', 'UEFA Champions League: Arsenal vs Paris Saint Germain', '2025-04-22 12:29:28', '2025-04-22 12:29:28'),
(22, 13, 'fdfe02bccad6f804d66852927a21a96f', 'Barcelona', 'h2h', '1.68', 'UEFA Champions League: Barcelona vs Internazionale Milano', '2025-04-22 12:31:06', '2025-04-22 12:31:06'),
(23, 14, '364380885afeec95fefdd85bf8cded29', 'Villarreal', 'h2h', '1.58', 'La Liga - Spain: Villarreal vs CA Osasuna', '2025-04-25 13:03:35', '2025-04-25 13:03:35'),
(24, 15, 'ab47fdb6554bfea433e0a50a1bf353ad', 'Villarreal', 'h2h', '1.46', 'La Liga - Spain: Villarreal vs Espanyol', '2025-04-25 13:14:51', '2025-04-25 13:14:51');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `idiomas`
--

CREATE TABLE `idiomas` (
  `id` int(11) NOT NULL,
  `codigo_iso` varchar(5) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  `usuari_nick` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `promo_id` bigint(20) UNSIGNED NOT NULL,
  `data_inscripcio` timestamp NULL DEFAULT NULL,
  `compleix_requisits` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `inscripcio_a_promos`
--

INSERT INTO `inscripcio_a_promos` (`usuari_nick`, `promo_id`, `data_inscripcio`, `compleix_requisits`) VALUES
('Albertpv24', 1, '2025-03-21 08:57:45', 1),
('Laura', 1, '2025-04-06 18:07:52', 0),
('Popi', 1, '2025-03-18 20:29:59', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `limitacio`
--

CREATE TABLE `limitacio` (
  `usuari_nick` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
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
(23, '2025_04_04_165908_create_chat_messages_table', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `password_resets`
--

INSERT INTO `password_resets` (`email`, `token`, `created_at`) VALUES
('albertpv24@alumnes.ilerna.com', '0xpBPuIfIIMLgceWeRqru90sEWi6H2e9KfV2eHJ1hR9UUVpqzxdcfODlMxDS', '2025-04-06 18:06:35'),
('albertpv24@gmail.com', 'jlnB36JbS6TcikySJgP8fucDXQc0dSlBU0YGFnAt6IyLzJdKSizPrjNCa9xd', '2025-04-11 14:39:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
(45, 'App\\Models\\User', 'Kakanata', 'auth-token', '9d3d8465dd2c562fb408faaeceb26f97f3d14c5c7e851b396607b9449a800263', '[\"*\"]', '2025-04-06 10:09:06', NULL, '2025-04-06 10:03:56', '2025-04-06 10:09:06'),
(46, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'ff536813a50df30f04a44220921096bddf5010b662ce2184f0acff07e38c53bc', '[\"*\"]', '2025-04-06 10:12:19', NULL, '2025-04-06 10:09:46', '2025-04-06 10:12:19'),
(47, 'App\\Models\\User', 'Kakanata', 'auth-token', '280f79668f132f2cb131da1c1eca34ed1f1e9227fe05ef320c2f36af7613a539', '[\"*\"]', '2025-04-06 10:15:28', NULL, '2025-04-06 10:12:32', '2025-04-06 10:15:28'),
(48, 'App\\Models\\User', 'Popi', 'auth-token', '2321fc258b5340028dd9dde35ced527fb43dfc98d17d1abf7fbe0364f98fc610', '[\"*\"]', '2025-04-06 10:26:38', NULL, '2025-04-06 10:17:09', '2025-04-06 10:26:38'),
(49, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'f324d380fb8c991cc946aa28dcd919099eb90f6003f40b22174b2ee31d615aad', '[\"*\"]', '2025-04-06 12:17:53', NULL, '2025-04-06 10:33:01', '2025-04-06 12:17:53'),
(50, 'App\\Models\\User', 'Albertpv24', 'auth-token', '0021f47ef6b4c117058ad9b1453ca0215b586b40a6e0d5c3a659dde3c5eb7228', '[\"*\"]', '2025-04-06 18:05:35', NULL, '2025-04-06 12:18:11', '2025-04-06 18:05:35'),
(51, 'App\\Models\\User', 'Laura', 'auth-token', 'd7562abeb69ffb0811aee8a73fa1899ba07cc14c08171c7689a6dd06d1344293', '[\"*\"]', '2025-04-06 18:09:27', NULL, '2025-04-06 18:07:00', '2025-04-06 18:09:27'),
(52, 'App\\Models\\User', 'admin', 'auth-token', 'fa316a56456852730435d527df72505da84909fb05e925be6116d05906339d0b', '[\"*\"]', '2025-04-06 18:12:38', NULL, '2025-04-06 18:09:42', '2025-04-06 18:12:38'),
(53, 'App\\Models\\User', 'Laura', 'auth-token', 'ab02d63af16bf96c7255a78904f19efd91406a3c7a44666a20d629533f37498a', '[\"*\"]', '2025-04-06 18:12:11', NULL, '2025-04-06 18:10:15', '2025-04-06 18:12:11'),
(54, 'App\\Models\\User', 'admin', 'auth-token', 'be4fac6833ed336eec3622eec5ab3ab3fb5cb2ab0e71d680c5a326423113633c', '[\"*\"]', '2025-04-07 16:17:27', NULL, '2025-04-07 11:37:47', '2025-04-07 16:17:27'),
(55, 'App\\Models\\User', 'Albertpv24', 'auth-token', '3cf2b6a473a0df47edea9d52a3d9b1579bbe351cb6bc7117db35a31504e675eb', '[\"*\"]', '2025-04-08 12:19:45', NULL, '2025-04-07 11:38:03', '2025-04-08 12:19:45'),
(56, 'App\\Models\\User', 'admin', 'auth-token', 'cae13185609b7a49b18b7da4da259be82ec852923e6b6c2b00c377162d4d882e', '[\"*\"]', '2025-04-08 16:16:58', NULL, '2025-04-08 11:28:25', '2025-04-08 16:16:58'),
(57, 'App\\Models\\User', 'Albertpv24', 'auth-token', '07fc3bacb92d1c40277a73fad262104aad393a50fa0bbf1c6413cf5cbd8c862a', '[\"*\"]', '2025-04-08 12:52:25', NULL, '2025-04-08 12:19:54', '2025-04-08 12:52:25'),
(58, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'ad2fb8910d9dbcce2d90fbd452b2d63788e86bbcc5cfff7ced7e9a9a5e91c19d', '[\"*\"]', '2025-04-08 12:54:13', NULL, '2025-04-08 12:53:19', '2025-04-08 12:54:13'),
(59, 'App\\Models\\User', 'Albertpv24', 'auth-token', '9bed56af30c67e8338c86caed0705dde5126687e0d9c928e90bec19d1539b0a8', '[\"*\"]', '2025-04-08 12:56:01', NULL, '2025-04-08 12:54:30', '2025-04-08 12:56:01'),
(60, 'App\\Models\\User', 'Popi', 'auth-token', 'aa03b5062621fbc13de77fdccf37df1c79bf5b96c11f2d5f15276d5fa7f8f0b1', '[\"*\"]', '2025-04-08 12:58:34', NULL, '2025-04-08 12:56:10', '2025-04-08 12:58:34'),
(61, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'bf394cde99fb8754c6aa788bfdfb9667c3d61efb9a4759a0265fb00cffd14410', '[\"*\"]', '2025-04-11 12:16:41', NULL, '2025-04-08 12:58:43', '2025-04-11 12:16:41'),
(62, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'e922f45b36d41593e990e31c4918967bf76e850f212ee67f683def497f256c5c', '[\"*\"]', '2025-04-11 08:46:13', NULL, '2025-04-11 08:34:19', '2025-04-11 08:46:13'),
(63, 'App\\Models\\User', 'PauGay', 'auth-token', 'dae45595ff832307a39f2d3a8ee43fe8cfcee3d6c387473195469e6ebcd9f38a', '[\"*\"]', '2025-04-11 12:18:42', NULL, '2025-04-11 12:17:29', '2025-04-11 12:18:42'),
(64, 'App\\Models\\User', 'admin', 'auth-token', '9972d5d04eb55580981b92f497994c95463a392576b9fd1d98c3204b8701a1d6', '[\"*\"]', '2025-04-11 15:14:29', NULL, '2025-04-11 12:17:59', '2025-04-11 15:14:29'),
(65, 'App\\Models\\User', 'Albertpv24', 'auth-token', '1de43573b27c307862c2eacd1591624aae70fcc6c2b0226e7998ed34d4a0f78c', '[\"*\"]', '2025-04-11 12:20:12', NULL, '2025-04-11 12:19:41', '2025-04-11 12:20:12'),
(66, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'ed148e190c3d0fae991a290712e06300975011defc7e8c2e3afa81da7fa4cf5d', '[\"*\"]', '2025-04-11 12:33:06', NULL, '2025-04-11 12:20:23', '2025-04-11 12:33:06'),
(67, 'App\\Models\\User', 'Popi', 'auth-token', '80829e53bb790d549534c28a9f2f5ae9cd24a0525991a2dbb567ebf6645e892a', '[\"*\"]', '2025-04-11 12:39:07', NULL, '2025-04-11 12:33:19', '2025-04-11 12:39:07'),
(68, 'App\\Models\\User', 'Popi', 'auth-token', '90bab16f3a010d68a2890a1000e580f80bb863008437468004ac9027bc3afd6e', '[\"*\"]', '2025-04-11 12:41:13', NULL, '2025-04-11 12:39:18', '2025-04-11 12:41:13'),
(69, 'App\\Models\\User', 'Albertpv24', 'auth-token', '1660ad2c5592494f65deb5744f2b025de71f70942efba609a029aee35557d342', '[\"*\"]', '2025-04-11 13:03:18', NULL, '2025-04-11 13:03:11', '2025-04-11 13:03:18'),
(70, 'App\\Models\\User', 'Albertpv24', 'auth-token', '4eedc77ff08da11c95b731e334c7a66ea9d5ba8e4a29fd8e3b21f98aa88b1992', '[\"*\"]', '2025-04-11 14:58:57', NULL, '2025-04-11 14:58:47', '2025-04-11 14:58:57'),
(71, 'App\\Models\\User', 'Popi', 'auth-token', 'f4f527c7a73e80a123796145a74bb1980c4920a1a341bb4877393c2fa1b98008', '[\"*\"]', '2025-04-22 11:28:08', NULL, '2025-04-11 14:59:12', '2025-04-22 11:28:08'),
(72, 'App\\Models\\User', 'admin', 'auth-token', '2e12910ce24636fd489a4430f1abc1250e8862d4ab90a37547fb9a595a85f8d3', '[\"*\"]', '2025-04-22 11:29:06', NULL, '2025-04-22 11:28:35', '2025-04-22 11:29:06'),
(73, 'App\\Models\\User', 'admin', 'auth-token', '31b2786155839c88c1709d402023582bbcca5a5520a3c1ea5ca499415e1b3679', '[\"*\"]', '2025-04-22 12:51:37', NULL, '2025-04-22 11:29:21', '2025-04-22 12:51:37'),
(74, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'f8084470a922bd91087719c87b5c7f0eed964e5fc2e507d8104f3b473bb56121', '[\"*\"]', '2025-04-22 12:25:34', NULL, '2025-04-22 11:29:42', '2025-04-22 12:25:34'),
(75, 'App\\Models\\User', 'Popi', 'auth-token', 'c8ea2ba8048cf48f0afd989fcfe4ef49689d9880d5f1ce097fedc69955134425', '[\"*\"]', '2025-04-22 12:28:41', NULL, '2025-04-22 12:28:00', '2025-04-22 12:28:41'),
(76, 'App\\Models\\User', 'Wispy', 'auth-token', '6f4a061725d3425feb377dba78d0b85d1b1c255760cbe272add1ce120ae2d1fe', '[\"*\"]', '2025-04-22 12:29:28', NULL, '2025-04-22 12:29:19', '2025-04-22 12:29:28'),
(77, 'App\\Models\\User', 'Albertpv24', 'auth-token', '655930bab20a83e8c88a5f9bb3cda9ac629a71c3e121487202c10c1022850f76', '[\"*\"]', '2025-04-22 12:30:48', NULL, '2025-04-22 12:30:32', '2025-04-22 12:30:48'),
(78, 'App\\Models\\User', 'Wispy', 'auth-token', '7f900118530bd587aff7792345aea306797556ebbc4b1075abce26b68ef0f1f8', '[\"*\"]', '2025-04-22 12:31:06', NULL, '2025-04-22 12:30:58', '2025-04-22 12:31:06'),
(79, 'App\\Models\\User', 'Albertpv24', 'auth-token', '5424b4e7abbe7a713b92be0eff7038a754ab5d232757cd5d8ab68f53256b7fc6', '[\"*\"]', '2025-04-22 12:34:14', NULL, '2025-04-22 12:32:41', '2025-04-22 12:34:14'),
(80, 'App\\Models\\User', 'Albertpv24', 'auth-token', '26d7d6248bc029f0954589325aa9ec0da0ea26ab27566f99bd074e2f1f9ea388', '[\"*\"]', '2025-04-22 12:35:23', NULL, '2025-04-22 12:35:16', '2025-04-22 12:35:23'),
(81, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'c0276fe5087baad4a61df5117b0aa6adfd12a51a9811b74785f77b2baae71be9', '[\"*\"]', '2025-04-22 12:37:04', NULL, '2025-04-22 12:37:02', '2025-04-22 12:37:04'),
(82, 'App\\Models\\User', 'Albertpv24', 'auth-token', '604769db8479209964940ca57def29eabdb1fb2ef43e591c40b72a9d3fbfbd17', '[\"*\"]', '2025-04-22 12:38:52', NULL, '2025-04-22 12:37:33', '2025-04-22 12:38:52'),
(83, 'App\\Models\\User', 'Albertpv24', 'auth-token', '9b64361d3060cae6ef67df51f053d9cd13588358fc19228395edfbb01b22d621', '[\"*\"]', '2025-04-22 12:40:35', NULL, '2025-04-22 12:39:26', '2025-04-22 12:40:35'),
(84, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'e501c1a361e12ddf6616a2f29db11b790f302c9acf460af74d7b930215917c3f', '[\"*\"]', '2025-04-22 12:42:32', NULL, '2025-04-22 12:40:44', '2025-04-22 12:42:32'),
(85, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'd9993ed592cd5921e7313691a7351ee11c5523b4845ef047f5c14c1068c2235d', '[\"*\"]', '2025-04-22 12:51:40', NULL, '2025-04-22 12:42:40', '2025-04-22 12:51:40'),
(86, 'App\\Models\\User', 'Albertpv24', 'auth-token', '59a991134716c2f6c0223b4d50ef103e9022d39d36bb044d9934b95e683c4b09', '[\"*\"]', '2025-04-22 12:51:52', NULL, '2025-04-22 12:51:49', '2025-04-22 12:51:52'),
(87, 'App\\Models\\User', 'Popi', 'auth-token', '7a1c01048dba91e765b35747697361e42e6cf57b57baacfbb4aac3c8d64baddb', '[\"*\"]', '2025-04-22 12:52:02', NULL, '2025-04-22 12:52:00', '2025-04-22 12:52:02'),
(88, 'App\\Models\\User', 'Popi', 'auth-token', 'ada57c1b9e37d5622fa0bdcede428ecd2f451f7eac0e3836c7cc0b338d79b943', '[\"*\"]', '2025-04-22 12:52:16', NULL, '2025-04-22 12:52:13', '2025-04-22 12:52:16'),
(89, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'f122f8a0fc479b2d1d93a69aa2813d93a4951b5ae5a67ed577c16dfe87220ec8', '[\"*\"]', '2025-04-22 12:53:50', NULL, '2025-04-22 12:53:47', '2025-04-22 12:53:50'),
(90, 'App\\Models\\User', 'Popi', 'auth-token', '4d076664d52f1e850d614595bc7b175a4c06e99ddec33babf3ee85fd736bef2b', '[\"*\"]', '2025-04-22 12:54:13', NULL, '2025-04-22 12:54:10', '2025-04-22 12:54:13'),
(91, 'App\\Models\\User', 'Popi', 'auth-token', '3dfd7ac21401c8881faffade7b106ac393256dc472d0517661c4ce18285a02e4', '[\"*\"]', '2025-04-22 12:55:12', NULL, '2025-04-22 12:54:34', '2025-04-22 12:55:12'),
(92, 'App\\Models\\User', 'Albertpv24', 'auth-token', '33b86c16c60c9d13756e937207ea1cee016f73e55f9b4ad58087f3707f2d56b3', '[\"*\"]', '2025-04-22 12:56:29', NULL, '2025-04-22 12:55:23', '2025-04-22 12:56:29'),
(93, 'App\\Models\\User', 'Popi', 'auth-token', '89c6b67dc231bf0a1a8b2f229974a5aea8db7374b49427cfb5181d8be043bd6b', '[\"*\"]', '2025-04-22 12:58:22', NULL, '2025-04-22 12:56:43', '2025-04-22 12:58:22'),
(94, 'App\\Models\\User', 'Albertpv24', 'auth-token', '81d5aea03b0290a272f7c041294f273ce3c533fa8057f22067f454122ca92ad0', '[\"*\"]', '2025-04-22 12:59:56', NULL, '2025-04-22 12:58:37', '2025-04-22 12:59:56'),
(95, 'App\\Models\\User', 'Albertpv24', 'auth-token', '1e2f47995252dee5dc4a9acfe7f6bc3a35ae7e3bb1353806f679bb6ba43bee18', '[\"*\"]', '2025-04-24 15:15:49', NULL, '2025-04-22 13:00:08', '2025-04-24 15:15:49'),
(96, 'App\\Models\\User', 'admin', 'auth-token', 'bdd5efae054a92dbc02f9802667a96fcb1b7e43df9be50defa1421420c47f3d9', '[\"*\"]', '2025-04-22 13:33:02', NULL, '2025-04-22 13:33:00', '2025-04-22 13:33:02'),
(97, 'App\\Models\\User', 'admin', 'auth-token', '23cd3cbafdb7edb29a7b0ad46e95aedb7b2ed75b66a06a19c0872d62d0045ee2', '[\"*\"]', '2025-04-24 13:17:46', NULL, '2025-04-24 11:30:36', '2025-04-24 13:17:46'),
(98, 'App\\Models\\User', 'admin', 'auth-token', 'e91cd543efa378937272cd3ac06b9221c63d242edc1b04467166c2a178a205bf', '[\"*\"]', '2025-04-25 13:03:58', NULL, '2025-04-24 15:15:54', '2025-04-25 13:03:58'),
(99, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'ae1bb4a5b94727d9927508362a6db0f58a98725d3ba4a642514cccdca59e8866', '[\"*\"]', '2025-04-25 13:14:33', NULL, '2025-04-25 11:39:41', '2025-04-25 13:14:33'),
(100, 'App\\Models\\User', 'admin', 'auth-token', 'ed7d73c437239ddc1d8a96c6339abb66b27cec47e57317ff90a8a9835c207d22', '[\"*\"]', '2025-04-25 13:05:26', NULL, '2025-04-25 13:04:04', '2025-04-25 13:05:26'),
(101, 'App\\Models\\User', 'admin', 'auth-token', '9b6162da4fe849cd5763b11d596b1bfb09825d8ba7d2542d30682a85e659d45d', '[\"*\"]', '2025-04-25 15:55:20', NULL, '2025-04-25 13:05:34', '2025-04-25 15:55:20'),
(102, 'App\\Models\\User', 'Popi', 'auth-token', 'f4c5b974d92ef55209e90755e49facba931ce3220a92af6b10f726b737dea353', '[\"*\"]', '2025-04-25 13:14:51', NULL, '2025-04-25 13:14:44', '2025-04-25 13:14:51'),
(103, 'App\\Models\\User', 'Albertpv24', 'auth-token', '100a0fc96f9abc0590217fb558fa700f41cf4319cd2466f4aa71f34467d7894d', '[\"*\"]', '2025-04-25 13:40:10', NULL, '2025-04-25 13:15:08', '2025-04-25 13:40:10'),
(104, 'App\\Models\\User', 'Albertpv24', 'auth-token', '3592b9d20833d4f7d82adb8a5da896fc00cf0d60aabc167741837fa7ee5d3521', '[\"*\"]', '2025-04-25 13:41:43', NULL, '2025-04-25 13:40:42', '2025-04-25 13:41:43'),
(105, 'App\\Models\\User', 'Albertpv24', 'auth-token', '2a0259950e24c7b55f22dffa5f60d7128cd4cb17b183de03c7a36cfbcc3b14a2', '[\"*\"]', '2025-04-25 13:42:39', NULL, '2025-04-25 13:42:36', '2025-04-25 13:42:39'),
(106, 'App\\Models\\User', 'Albertpv24', 'auth-token', '534a304bef375093c0ff6107ede5e7f34ed2afe30d4c6702fb1319a57827fd63', '[\"*\"]', '2025-04-25 13:43:41', NULL, '2025-04-25 13:43:38', '2025-04-25 13:43:41'),
(107, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'a1e03a8981ccf25ea8084f621fe649798e9f85252a3884797d3aab8c49183479', '[\"*\"]', '2025-04-25 13:45:28', NULL, '2025-04-25 13:44:27', '2025-04-25 13:45:28'),
(108, 'App\\Models\\User', 'Albertpv24', 'auth-token', '943437a57d5245f4d9c025523a1c6376debad405302558ac126627da6c9cceed', '[\"*\"]', '2025-04-25 13:47:51', NULL, '2025-04-25 13:46:14', '2025-04-25 13:47:51'),
(109, 'App\\Models\\User', 'Popi', 'auth-token', '32f014e4329bc4fcba1e471dd13a4b37e406077c7e3d3abb1c57e53e64090c11', '[\"*\"]', '2025-04-25 14:44:31', NULL, '2025-04-25 13:48:17', '2025-04-25 14:44:31'),
(110, 'App\\Models\\User', 'Albertpv24', 'auth-token', '17dcc0cdb06a9ddfccc0eaf13a4ccce05f0de328f0977907a6463b8c12b9f18f', '[\"*\"]', '2025-04-25 14:50:09', NULL, '2025-04-25 14:44:54', '2025-04-25 14:50:09'),
(111, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'b5f2a26e64689f71f9d9a3fc6c63b8bb4148b48ca7d68ecbb67543d583492fa4', '[\"*\"]', '2025-04-25 15:27:15', NULL, '2025-04-25 15:04:50', '2025-04-25 15:27:15'),
(112, 'App\\Models\\User', 'Wispy', 'auth-token', '59f646a501c98f1cb449625471d050f37bed69a8ebc629b4a82f0310aac3ea3a', '[\"*\"]', '2025-04-25 15:30:27', NULL, '2025-04-25 15:28:26', '2025-04-25 15:30:27'),
(113, 'App\\Models\\User', 'Wispy', 'auth-token', 'f11fc2f9a0f52b96d4eca5c7ca8c96b0f831603179426f81d241e674ca5455ad', '[\"*\"]', '2025-04-25 15:31:27', NULL, '2025-04-25 15:30:44', '2025-04-25 15:31:27'),
(114, 'App\\Models\\User', 'Wispy', 'auth-token', 'd251dc2f06c35a79b677c99d656caa1edb8552a8b932ea3293f94747bea74bfc', '[\"*\"]', '2025-04-25 15:46:21', NULL, '2025-04-25 15:46:18', '2025-04-25 15:46:21'),
(115, 'App\\Models\\User', 'Wispy', 'auth-token', '65665c3daae8b96aa56a011db83703bd674edf9cc3e86acb4e3c861fe8ed95ed', '[\"*\"]', '2025-04-25 15:46:32', NULL, '2025-04-25 15:46:29', '2025-04-25 15:46:32'),
(116, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'fc5c4f7438781efceae227c6bc0294418e87e5713246cb30a8d97ee33bf23275', '[\"*\"]', '2025-04-25 15:53:22', NULL, '2025-04-25 15:46:44', '2025-04-25 15:53:22'),
(117, 'App\\Models\\User', 'Wispy', 'auth-token', 'cf3ce751d44f22ea47336643bfb01417fc55a1899f4093d851e46e04d9858deb', '[\"*\"]', '2025-04-25 15:53:32', NULL, '2025-04-25 15:53:29', '2025-04-25 15:53:32'),
(118, 'App\\Models\\User', 'Wispy', 'auth-token', 'd9bcc2c917b8205a968142fb6d618814e2585a89e0f2f15e9077efc70cf40205', '[\"*\"]', '2025-04-25 15:55:33', NULL, '2025-04-25 15:55:30', '2025-04-25 15:55:33'),
(119, 'App\\Models\\User', 'Wispy', 'auth-token', '53e396c3ac6a6d13b9ed3eeabc52d9e9bc4bfb8027d69039bad106a1ef45b682', '[\"*\"]', '2025-04-25 15:55:55', NULL, '2025-04-25 15:55:52', '2025-04-25 15:55:55'),
(120, 'App\\Models\\User', 'Wispy', 'auth-token', '6cb7ebbcc78d77fc3eefc4e2347664e1fa09d3e10c2356f0d34f97818c26697a', '[\"*\"]', '2025-04-25 15:56:08', NULL, '2025-04-25 15:56:05', '2025-04-25 15:56:08'),
(121, 'App\\Models\\User', 'Albertpv24', 'auth-token', '9176e57404fba4e14ccaf66f3f528401262740a9245e07a502c2b7ed4a40188f', '[\"*\"]', '2025-04-29 11:29:46', NULL, '2025-04-29 11:29:12', '2025-04-29 11:29:46');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prediccions_sist`
--

CREATE TABLE `prediccions_sist` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `usuari_nick` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
(5, 'Wispy', 1, 5, 25, 1),
(6, 'Laura', 6, 6, 100, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prediccio_proposada`
--

CREATE TABLE `prediccio_proposada` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `usuari_nick` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cuota` decimal(10,2) NOT NULL,
  `punts_proposats` decimal(10,2) NOT NULL,
  `tipo_apuesta` enum('simple','parlay') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'simple',
  `match_info` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prediction_choice` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `prediccio_proposada`
--

INSERT INTO `prediccio_proposada` (`id`, `usuari_nick`, `cuota`, `punts_proposats`, `tipo_apuesta`, `match_info`, `prediction_choice`) VALUES
(1, 'Wispy', '7.00', '25.00', 'simple', 'UEFA Champions League: Paris Saint Germain vs Aston Villa', NULL),
(2, 'Wispy', '1.40', '1.00', 'simple', 'UEFA Champions League: Barcelona vs Borussia Dortmund', 'Barcelona'),
(3, 'Albertpv24', '45.08', '1000.00', 'parlay', 'La Liga - Spain: Real Madrid vs Leganés + La Liga - Spain: Alavés vs Rayo Vallecano + UEFA Champions League: Barcelona vs Borussia Dortmund', 'Leganés + Alavés + Barcelona'),
(4, 'Albertpv24', '9.66', '10.00', 'parlay', 'La Liga - Spain: Getafe vs Villarreal + La Liga - Spain: Valladolid vs Getafe', 'Villarreal + Valladolid'),
(6, 'Laura', '9.25', '100.00', 'parlay', 'La Liga - Spain: Villarreal vs Athletic Bilbao + La Liga - Spain: Celta Vigo vs Espanyol', 'Empate + Empate'),
(7, 'Albertpv24', '3.30', '10.00', 'parlay', 'La Liga - Spain: Alavés vs Real Madrid + UEFA Champions League: Bayern München vs Internazionale Milano', 'Real Madrid + Bayern München'),
(9, 'Albertpv24', '5.85', '182.00', 'parlay', 'UEFA Champions League: Barcelona vs Internazionale Milano + UEFA Champions League: Arsenal vs Paris Saint Germain', 'Barcelona + Empate'),
(10, 'Popi', '1.68', '100.00', 'simple', 'UEFA Champions League: Barcelona vs Internazionale Milano', 'Barcelona'),
(11, 'Popi', '1.68', '100.00', 'simple', 'UEFA Champions League: Barcelona vs Internazionale Milano', 'Barcelona'),
(12, 'Wispy', '2.14', '10.00', 'simple', 'UEFA Champions League: Arsenal vs Paris Saint Germain', 'Arsenal'),
(13, 'Wispy', '1.68', '10.00', 'simple', 'UEFA Champions League: Barcelona vs Internazionale Milano', 'Barcelona'),
(14, 'Albertpv24', '1.58', '10.00', 'simple', 'La Liga - Spain: Villarreal vs CA Osasuna', 'Villarreal'),
(15, 'Popi', '1.46', '10.00', 'simple', 'La Liga - Spain: Villarreal vs Espanyol', 'Villarreal');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `premis`
--

INSERT INTO `premis` (`id`, `titol`, `descripcio`, `cost`, `condicio`, `image`) VALUES
(1, 'Tour Per Lleida', 'Visita guiada por los lugares más emblemáticos de Lleida', '1500.00', '1.00', 'uploads/premios/tour.png'),
(2, 'Karting Alpicat', 'Sesión de karting en el circuito de Alpicat', '2000.00', '1.00', 'uploads/premios/karting.png'),
(3, 'Cena Gourmet', 'Cena para dos personas en un restaurante de alta cocina', '3000.00', '1.00', 'uploads/premios/cena.png'),
(4, 'Entradas VIP Lleida Esportiu', 'Dos entradas VIP para un partido del Lleida Esportiu', '1000.00', '1.00', 'uploads/premios/entradas.png'),
(5, 'Partit del Hoops Lleida', 'Entrada para un partido del Hoops Lleida en el Barris Nord', '500.00', '1.00', 'uploads/premios/tour.png'),
(6, 'Escape Room Lleida', 'Experiencia de escape room para ti y tus amigos en Lleida', '2500.00', '1.00', 'uploads/premios/escape.png'),
(7, 'Visita Guiada Museu de Lleida', 'Visita guiada al Museu de Lleida con acceso a todas las exposiciones', '800.00', '1.00', 'uploads/premios/museu.png'),
(8, 'Entrada Camp Nou Experience', 'Visita al estadio del FC Barcelona con el tour completo', '3000.00', '1.00', 'uploads/premios/camp-nou.png'),
(9, 'Visita a la Sagrada Familia', 'Entrada con audioguía para visitar la Sagrada Familia en Barcelona', '2800.00', '1.00', 'uploads/premios/sagrada.png'),
(10, 'Tour por Montserrat', 'Excursión guiada a la montaña de Montserrat con visita al monasterio', '3500.00', '1.00', 'uploads/premios/montserrat.png'),
(11, 'Entrada Partido RCD Espanyol', 'Entrada para un partido del RCD Espanyol en el RCDE Stadium', '10000.00', '1.00', 'uploads/premios/espanyol.png'),
(12, 'Festival Castell de Peralada', 'Entrada para el prestigioso festival de música y danza en el Castell de Peralada', '2200.00', '1.00', 'uploads/premios/peralada.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `premis_traduccions`
--

CREATE TABLE `premis_traduccions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `premi_id` bigint(20) UNSIGNED NOT NULL,
  `idioma_id` int(11) NOT NULL,
  `titol` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcio` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
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
  `usuari_nick` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `premi_id` bigint(20) UNSIGNED NOT NULL,
  `data_reclamat` timestamp NOT NULL DEFAULT current_timestamp(),
  `data_limit` datetime GENERATED ALWAYS AS (`data_reclamat` + interval 1 month) STORED,
  `usat` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `premis_usuaris`
--

INSERT INTO `premis_usuaris` (`id`, `usuari_nick`, `premi_id`, `data_reclamat`, `usat`) VALUES
(1, 'Albertpv24', 1, '2025-03-21 09:02:30', 0),
(2, 'Albertpv24', 2, '2025-03-21 09:02:40', 0),
(4, 'Albertpv24', 4, '2025-04-10 12:17:01', 0),
(5, 'Albertpv24', 4, '2025-04-10 12:17:14', 0),
(6, 'Albertpv24', 3, '2025-04-10 15:11:19', 0),
(7, 'Albertpv24', 3, '2025-04-10 15:11:51', 0),
(8, 'Albertpv24', 3, '2025-04-10 15:15:55', 0),
(9, 'Albertpv24', 3, '2025-04-10 15:19:39', 1),
(10, 'Albertpv24', 3, '2025-04-10 15:23:31', 1);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  `titol` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcio` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resultat_prediccio`
--

CREATE TABLE `resultat_prediccio` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `resultat_prediccio` enum('Guanyat','Perdut','Empat') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `validacio` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
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
(7, 'Perdut', 'Verificado por administrador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipus_promocio`
--

CREATE TABLE `tipus_promocio` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `titol` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcio` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
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
  `nick` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pswd` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuaris`
--

CREATE TABLE `usuaris` (
  `nick` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipus_acc` enum('Usuari','Usuari_premium','Administrador') COLLATE utf8mb4_unicode_ci NOT NULL,
  `pswd` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `saldo` decimal(10,2) NOT NULL DEFAULT 0.00,
  `creat_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualitzat_el` date DEFAULT NULL,
  `apostes_realitzades` int(11) NOT NULL DEFAULT 0,
  `temps_diari` int(11) NOT NULL DEFAULT 3600,
  `bloquejat` tinyint(1) NOT NULL DEFAULT 0,
  `dni` varchar(9) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefon` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_naixement` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuaris`
--

INSERT INTO `usuaris` (`nick`, `email`, `tipus_acc`, `pswd`, `profile_image`, `saldo`, `creat_at`, `actualitzat_el`, `apostes_realitzades`, `temps_diari`, `bloquejat`, `dni`, `telefon`, `data_naixement`) VALUES
('admin', 'admin@admin.com', 'Administrador', '$2y$12$Z/YcfH1M3uHsmFh4pAgs1Oak.8TyilxKpdRDHRrq2vYOyVxd8/41a', NULL, '0.00', '2025-03-18 19:40:11', NULL, 0, 3600, 0, '', NULL, '2025-03-18'),
('Albertpv24', 'albertpv24@gmail.com', 'Usuari', '$2y$12$TVwtTCsMNeJolPXn2Lb0De0gOKDR1vOWC9hKL07HsxLYDP/mc8sSS', 'uploads/profiles/profile_1742315811_67d9a12336465.png', '10026014.60', '2025-03-18 16:36:51', NULL, 0, 3600, 0, '48052260Q', '645554144', '2003-04-24'),
('Kakanata', 'kaka@gmail.com', 'Usuari', '$2y$12$m.5hQcP2Z5TwcwdafWw/7.7B6W27m5rVgOJ//dUq0jdrJyxwqCRNi', NULL, '0.00', '2025-04-06 12:03:48', NULL, 0, 3600, 0, '98746432P', '987654367', '2000-01-01'),
('Laura', 'albertpv24@alumnes.ilerna.com', 'Usuari', '$2y$12$1fCV5x8BHiyha05jp6Vmh.sLbKqZv6Ab0mn8aypO9.f/W/2e3ygaW', NULL, '925.00', '2025-04-06 20:06:23', NULL, 0, 3600, 0, '98764738L', '645789876', '2005-05-22'),
('Popi', 'popi@gmail.com', 'Usuari', '$2y$12$BX7MI1gk/wBpxU/TQ6WskeQws.qyY.deS2gXQC4o.AXY19OZ7dOl2', NULL, '1790.00', '2025-03-18 21:24:47', NULL, 0, 3600, 0, '34628123D', '389487231', '2025-03-18'),
('Wispy', 'paudomec@alumnes.ilerna.com', 'Usuari', '$2y$12$iVGmPHaf.eyGoThYf99u1u4iA3xVcDDa1Gj7gc7WJHrQJ7.2ANdOu', 'uploads/profiles/profile_1742315104_67d99e60222b0.png', '177.40', '2025-03-18 16:25:04', NULL, 0, 3600, 0, '48059629W', '611411604', '2004-11-30');

--
-- Índices para tablas volcadas
--

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
-- AUTO_INCREMENT de la tabla `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT de la tabla `chat_sessions`
--
ALTER TABLE `chat_sessions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `daily_rewards_tracking`
--
ALTER TABLE `daily_rewards_tracking`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `detalle_prediccio`
--
ALTER TABLE `detalle_prediccio`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `idiomas`
--
ALTER TABLE `idiomas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT de la tabla `prediccions_sist`
--
ALTER TABLE `prediccions_sist`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `prediccio_proposada`
--
ALTER TABLE `prediccio_proposada`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `premis`
--
ALTER TABLE `premis`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `premis_traduccions`
--
ALTER TABLE `premis_traduccions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT de la tabla `premis_usuaris`
--
ALTER TABLE `premis_usuaris`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
-- Filtros para la tabla `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `usuaris` (`nick`),
  ADD CONSTRAINT `chat_messages_chat_session_id_foreign` FOREIGN KEY (`chat_session_id`) REFERENCES `chat_sessions` (`session_id`),
  ADD CONSTRAINT `chat_messages_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuaris` (`nick`);

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
