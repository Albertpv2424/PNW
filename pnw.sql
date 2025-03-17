-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-03-2025 a las 16:24:10
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
('Albertpv24', 1, '2025-03-15 13:46:01', 0);

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
(13, 'add_image_to_premis_and_promos', 1),
(14, 'add_profile_image_to_usuaris_table', 1),
(15, 'update_personal_access_tokens_table', 2),
(16, 'add_data_inscripcio_to_inscripcio_a_promos', 3),
(17, 'create_password_resets_table', 4);

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
('albertpv24@alumnes.ilerna.com', 'bJBVwrQHTYMHwhNdhKXnbUlRNSS4BSCFolhtibwK0LrVpMolJY2rcUCbgNGZ', '2025-03-16 13:21:28'),
('albertpv24@gmail.com', 'Z1C7s1dVnridXki1AM2A4W800TOwuwlWdzUHC5Ne8vy54CWbt2UkwHUdnyc7', '2025-03-16 14:18:51');

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
(1, 'App\\Models\\User', 'Albertpv24', 'auth-token', '125a984d239f1bfe1ec3e26d410eb5d55c61defe50646c3204ce24686c8c64d2', '[\"*\"]', '2025-03-15 14:10:27', NULL, '2025-03-15 13:42:46', '2025-03-15 14:10:27'),
(2, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'dbb7a9843e543988b45a0e338d13e1bd50479416b3fe51aec866a5951f10589f', '[\"*\"]', NULL, NULL, '2025-03-15 14:15:27', '2025-03-15 14:15:27'),
(3, 'App\\Models\\User', 'Pau', 'auth-token', '120c2043a8454a875c4d755ef3614b57e56f306b78f2d1291d88daaae9c91aac', '[\"*\"]', '2025-03-15 14:19:38', NULL, '2025-03-15 14:19:06', '2025-03-15 14:19:38'),
(4, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'df41bdbf888cf5f61a54469704c7ebce5fd1b74dece214d64bcf4a5da724d822', '[\"*\"]', '2025-03-15 14:26:12', NULL, '2025-03-15 14:25:54', '2025-03-15 14:26:12'),
(5, 'App\\Models\\User', 'Albertpv24', 'auth-token', '04ce29883ccc3ffcc609f52b3bd54413ab4baec7f9afe6e9e0ed5c60597c46ed', '[\"*\"]', '2025-03-15 14:35:18', NULL, '2025-03-15 14:30:48', '2025-03-15 14:35:18'),
(6, 'App\\Models\\User', 'Albertpv24', 'auth-token', '50b8ab70d1c1087908b4192d78afce7948f8cf9ae9d8e62908c3d02ca58ebd61', '[\"*\"]', '2025-03-15 14:43:25', NULL, '2025-03-15 14:37:38', '2025-03-15 14:43:25'),
(7, 'App\\Models\\User', 'Albertpv24', 'auth-token', 'be474d1c8c64bc1bfca1e0ed2562c24d9acb17dea207049ed9eb4c5ff297f26b', '[\"*\"]', '2025-03-15 14:52:36', NULL, '2025-03-15 14:45:04', '2025-03-15 14:52:36'),
(8, 'App\\Models\\User', 'Pau', 'auth-token', '1ccf0512a3e641acf97250b4154282c5eff0222835c8dfff61835ed921e1d668', '[\"*\"]', '2025-03-15 14:53:55', NULL, '2025-03-15 14:53:42', '2025-03-15 14:53:55'),
(9, 'App\\Models\\User', 'Pau', 'auth-token', 'e909ce595ee401aaa6c3553d19ce023328ad117407b6d10e4f43257640b3df43', '[\"*\"]', '2025-03-15 14:57:39', NULL, '2025-03-15 14:54:23', '2025-03-15 14:57:39'),
(10, 'App\\Models\\User', 'Albertpv24', 'auth-token', '2373de257e1589e26321dfe18378fb3481cfe33383ce132b59644e4c3b6bc7dd', '[\"*\"]', '2025-03-15 14:57:55', NULL, '2025-03-15 14:57:50', '2025-03-15 14:57:55'),
(11, 'App\\Models\\User', 'Pau', 'auth-token', 'cbc8b6128ab9a8cd68a0f9f312668c52d212b067f961cae0b20c5785a9c64798', '[\"*\"]', '2025-03-15 14:59:06', NULL, '2025-03-15 14:58:08', '2025-03-15 14:59:06'),
(12, 'App\\Models\\User', 'Albertpv24', 'auth-token', '65977a7f1678e4a69fa2a93901f98791cd79172171d6155588dbb94c6d074c2d', '[\"*\"]', '2025-03-15 15:00:57', NULL, '2025-03-15 15:00:11', '2025-03-15 15:00:57'),
(13, 'App\\Models\\User', 'Pau', 'auth-token', '1fd67243f5902708a4ec6986cffa6873a1c11c743af0e4067f5ba2959e24e482', '[\"*\"]', '2025-03-15 15:01:16', NULL, '2025-03-15 15:01:09', '2025-03-15 15:01:16'),
(14, 'App\\Models\\User', 'Albertpv24', 'auth-token', '8cd9979522bf14552385a16dca380c6990b5ac58d448398230467828d2843e58', '[\"*\"]', '2025-03-15 22:01:54', NULL, '2025-03-15 21:59:18', '2025-03-15 22:01:54'),
(15, 'App\\Models\\User', 'Admin', 'auth-token', 'a11869fc5923fde39c5a01c98e2bbe4bf8487eea9ea3029c8411f6c2f8a9911c', '[\"*\"]', NULL, NULL, '2025-03-15 23:28:40', '2025-03-15 23:28:40'),
(16, 'App\\Models\\User', 'Albertpv24', 'auth-token', '0ab9d0d7d64de4706085835c8afed3b7913a5520f1f37ef52ee859fca316602e', '[\"*\"]', NULL, NULL, '2025-03-15 23:28:56', '2025-03-15 23:28:56'),
(17, 'App\\Models\\User', 'Albertpv24', 'auth-token', '4a92294abf9810a2ff498831b221169d35369423fa83b1fb5f6897d42ca9437e', '[\"*\"]', '2025-03-16 00:31:07', NULL, '2025-03-16 00:31:00', '2025-03-16 00:31:07'),
(18, 'App\\Models\\User', 'Pau', 'auth-token', '587d58d3f16e23bb7e8849a58b9f83b436fb2439fc7b64095e73bef13f359067', '[\"*\"]', '2025-03-16 01:14:21', NULL, '2025-03-16 01:11:50', '2025-03-16 01:14:21'),
(19, 'App\\Models\\User', 'Albertpv24', 'auth-token', '8c1d3161909dadf2e463ec9fc432961783f908e01563dc03b47b3a38960773aa', '[\"*\"]', '2025-03-16 01:15:26', NULL, '2025-03-16 01:14:28', '2025-03-16 01:15:26'),
(20, 'App\\Models\\User', 'Albertpv24', 'auth-token', '399d9a3192d36c804f66e486d727b3acb10041a5674ffd3784294fd3d5f804bb', '[\"*\"]', '2025-03-16 12:11:46', NULL, '2025-03-16 11:24:50', '2025-03-16 12:11:46'),
(21, 'App\\Models\\User', 'Papa', 'auth-token', 'acd4504bafd62151dfa963f21ad0e22bc4dab413a6b19c2efbc72cefb4a6f89b', '[\"*\"]', '2025-03-16 13:23:41', NULL, '2025-03-16 13:22:18', '2025-03-16 13:23:41'),
(22, 'App\\Models\\User', 'Papa', 'auth-token', '47228b7187b7c4631103f66586fbf35958c8469542661096a4774251b7ed3e19', '[\"*\"]', '2025-03-16 13:28:39', NULL, '2025-03-16 13:23:49', '2025-03-16 13:28:39'),
(23, 'App\\Models\\User', 'Albertpv24', 'auth-token', '80164d0d38b2c92e8a72a2045372e3683d594f6f0dc28fb6415f505aa41d465a', '[\"*\"]', '2025-03-16 14:17:24', NULL, '2025-03-16 14:12:42', '2025-03-16 14:17:24'),
(24, 'App\\Models\\User', 'Albertpv24', 'auth-token', '6279b93083d9604a3ec806bebadb78131c199fcfa94fcdc320d0eac281dbc6ff', '[\"*\"]', '2025-03-16 14:22:30', NULL, '2025-03-16 14:19:14', '2025-03-16 14:22:30');

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prediccio_proposada`
--

CREATE TABLE `prediccio_proposada` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `usuari_nick` varchar(50) NOT NULL,
  `cuota` decimal(10,2) NOT NULL,
  `punts_proposats` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(4, 'Entradas VIP Lleida Esportiu', 'Dos entradas VIP para un partido del Lleida Esportiu', 1000.00, 1.00, 'uploads/premios/entradas.png');

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
(1, 'Albertpv24', 4, '2025-03-15 14:52:13', 0),
(2, 'Albertpv24', 1, '2025-03-15 14:52:36', 0),
(4, 'Albertpv24', 1, '2025-03-15 15:00:51', 0),
(5, 'Albertpv24', 3, '2025-03-16 11:25:49', 0);

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
('Admin', 'admin@admin.com', 'Administrador', '$2y$12$IIyc1NTGaJ6Mbw3NHZRkx.H4AuRrUc26PeBTMESqb8qJ7RMeWYJii', NULL, 0.00, '2025-03-16 00:26:20', NULL, 0, 3600, 0, '', NULL, '0000-00-00'),
('Albertpv24', 'albertpv24@gmail.com', 'Usuari', '$2y$12$nif3I.g3GYw4vh2CIs1EOOQQaFG/hPQCTadrGHCloHcmLh7qQy9Fa', 'uploads/profiles/profile_1742039638_67d56a56eea4f.jpeg', 3551.00, '2025-03-15 11:53:59', NULL, 0, 3600, 0, '48052260Q', '645554144', '2003-04-24');

--
-- Índices para tablas volcadas
--

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
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `prediccions_sist`
--
ALTER TABLE `prediccions_sist`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `prediccio_proposada`
--
ALTER TABLE `prediccio_proposada`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `premis`
--
ALTER TABLE `premis`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `premis_usuaris`
--
ALTER TABLE `premis_usuaris`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `promos`
--
ALTER TABLE `promos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `resultat_prediccio`
--
ALTER TABLE `resultat_prediccio`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

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
