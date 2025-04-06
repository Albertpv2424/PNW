-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-04-2025 a las 13:22:19
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
(1, 'Albertpv24', NULL, 'hola', 0, 0, '30548df4-583c-4a57-8818-5a581c0c70b1', '2025-04-06 08:24:11', '2025-04-06 08:24:11'),
(2, 'Albertpv24', NULL, 'aloh', 0, 0, '30548df4-583c-4a57-8818-5a581c0c70b1', '2025-04-06 08:27:45', '2025-04-06 08:27:45'),
(3, 'Albertpv24', NULL, 'aloh', 0, 0, '30548df4-583c-4a57-8818-5a581c0c70b1', '2025-04-06 08:27:45', '2025-04-06 08:27:45'),
(4, 'Albertpv24', NULL, 'aloh', 0, 0, '30548df4-583c-4a57-8818-5a581c0c70b1', '2025-04-06 08:27:46', '2025-04-06 08:27:46'),
(5, 'Albertpv24', NULL, 'hola', 0, 0, '30548df4-583c-4a57-8818-5a581c0c70b1', '2025-04-06 08:31:30', '2025-04-06 08:31:30'),
(6, 'admin', NULL, 'yep', 1, 1, '30548df4-583c-4a57-8818-5a581c0c70b1', '2025-04-06 09:15:07', '2025-04-06 09:15:18'),
(7, 'admin', NULL, 'jeje', 1, 1, '30548df4-583c-4a57-8818-5a581c0c70b1', '2025-04-06 09:16:24', '2025-04-06 09:16:28'),
(8, 'Albertpv24', NULL, 'NECESITO ALGO', 0, 0, '30548df4-583c-4a57-8818-5a581c0c70b1', '2025-04-06 09:18:42', '2025-04-06 09:18:42'),
(9, 'admin', NULL, 'si dime?', 1, 1, '30548df4-583c-4a57-8818-5a581c0c70b1', '2025-04-06 09:18:52', '2025-04-06 09:18:55');

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
(1, '30548df4-583c-4a57-8818-5a581c0c70b1', 'Albertpv24', 'admin', 'si dime?', '2025-04-06 09:18:52', 1, '2025-04-06 08:18:55', '2025-04-06 09:18:52');

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
(6, 'Albertpv24', '2025-03-21', 1, 75, 0, 0, 0, 5, 0, 3600, '2025-03-21 09:25:58', '2025-03-21 09:35:44');

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
(7, 4, '3eac51545c1860f07789ca6be6464e58', 'Valladolid', 'h2h', 4.20, 'La Liga - Spain: Valladolid vs Getafe', '2025-03-21 09:03:42', '2025-03-21 09:03:42');

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
('Albertpv24', 1, '2025-03-21 08:57:45', 1),
('Popi', 1, '2025-03-18 20:29:59', 1);

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
(23, '2025_04_04_165908_create_chat_messages_table', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(35, 'App\\Models\\User', 'Albertpv24', 'auth-token', '734875c9ba2e529b8822867c02d657f3df38a0bcc29776f282168380328c4d43', '[\"*\"]', '2025-04-06 09:20:25', NULL, '2025-04-06 08:18:33', '2025-04-06 09:20:25'),
(36, 'App\\Models\\User', 'admin', 'auth-token', '6404bf27961b951ff7439435ab8607b84b138233a4c67355cb9ba2541c282037', '[\"*\"]', '2025-04-06 08:24:29', NULL, '2025-04-06 08:18:50', '2025-04-06 08:24:29'),
(37, 'App\\Models\\User', 'admin', 'auth-token', 'e5139677f9794bb584c2de97ec59b2a05f8fa169628948208cf964d388b26535', '[\"*\"]', '2025-04-06 08:31:54', NULL, '2025-04-06 08:24:34', '2025-04-06 08:31:54'),
(38, 'App\\Models\\User', 'admin', 'auth-token', 'f2e64eba2f824b16a3c92bb8f915a6e6311fe709c0c1c9442558c4291cda826e', '[\"*\"]', '2025-04-06 09:22:16', NULL, '2025-04-06 08:32:23', '2025-04-06 09:22:16');

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
(2, 'Albertpv24', 3, 2, 1000, 1);

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
(4, 'Albertpv24', 9.66, 10.00, 'parlay', 'La Liga - Spain: Getafe vs Villarreal + La Liga - Spain: Valladolid vs Getafe', 'Villarreal + Valladolid');

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
(1, 'Albertpv24', 1, '2025-03-21 09:02:30', 0),
(2, 'Albertpv24', 2, '2025-03-21 09:02:40', 0);

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
(3, 'Guanyat', 'Verificado por administrador');

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
('Albertpv24', 'albertpv24@gmail.com', 'Usuari', '$2y$12$wyfpGoWwBl8VDWUEWdVXO.iZb2a5/l.jZwtFERfkjbpK.PKtJChha', 'uploads/profiles/profile_1742315811_67d9a12336465.png', 10042555.00, '2025-03-18 16:36:51', NULL, 0, 3600, 0, '48052260Q', '645554144', '2003-04-24'),
('Popi', 'popi@gmail.com', 'Usuari', '$2y$12$OCehk6aNov30qa0uGlq9FuWyQmUGOXqEqsH9CZdoMELntSPtHi.P.', NULL, 1500.00, '2025-03-18 21:24:47', NULL, 0, 3600, 0, '34628123D', '389487231', '2025-03-18'),
('Wispy', 'paudomec@alumnes.ilerna.com', 'Usuari', '$2y$12$iVGmPHaf.eyGoThYf99u1u4iA3xVcDDa1Gj7gc7WJHrQJ7.2ANdOu', 'uploads/profiles/profile_1742315104_67d99e60222b0.png', 22.40, '2025-03-18 16:25:04', NULL, 0, 3600, 0, '48059629W', '611411604', '2004-11-30');

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `chat_sessions`
--
ALTER TABLE `chat_sessions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `daily_rewards_tracking`
--
ALTER TABLE `daily_rewards_tracking`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `detalle_prediccio`
--
ALTER TABLE `detalle_prediccio`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `prediccions_sist`
--
ALTER TABLE `prediccions_sist`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `prediccio_proposada`
--
ALTER TABLE `prediccio_proposada`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `premis`
--
ALTER TABLE `premis`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `premis_usuaris`
--
ALTER TABLE `premis_usuaris`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `promos`
--
ALTER TABLE `promos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `resultat_prediccio`
--
ALTER TABLE `resultat_prediccio`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
