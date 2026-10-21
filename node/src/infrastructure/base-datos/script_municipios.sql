-- ============================================================================
-- Script: script_municipios.sql
-- Descripción: crea la tabla `municipios` en la base de datos `gemeloDigital`
--              e inserta el catálogo completo de los 217 municipios oficiales
--              del estado de Puebla (fuente: INEGI, división municipal 2020).
--
-- La columna `region` usa la regionalización socioeconómica vigente del
-- Plan Estatal de Desarrollo (PED) 2024-2030 del Gobierno del Estado de Puebla,
-- organizada en siete macrorregiones:
--   1. Sierra Norte (38 municipios)
--   2. Sierra Nororiental (26 municipios)
--   3. Valle de Serdán (40 municipios)
--   4. Angelópolis (22 municipios)
--   5. Valle de Atlixco y Matamoros (22 municipios)
--   6. Mixteca (43 municipios)
--   7. Tehuacán y Sierra Negra (26 municipios)
-- Total: 38+26+40+22+22+43+26 = 217 municipios
--
-- Uso: ejecutar sobre la base de datos configurada en src/.env (DB_NAME).
-- ============================================================================

USE gemeloDigital;

CREATE TABLE IF NOT EXISTS municipios (
    id INT NOT NULL COMMENT 'Clave INEGI del municipio (001 a 217)',
    nombre VARCHAR(100) NOT NULL COMMENT 'Nombre oficial del municipio',
    region VARCHAR(50) NOT NULL COMMENT 'Macrorregión socioeconómica del estado de Puebla',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Limpieza defensiva para poder re-ejecutar el script sin duplicados.
DELETE FROM municipios;

-- Catálogo completo: clave INEGI, nombre y macrorregión.
INSERT INTO municipios (id, nombre, region) VALUES (1, 'Acajete', 'Angelópolis');
INSERT INTO municipios (id, nombre, region) VALUES (2, 'Acateno', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (3, 'Acatlán', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (4, 'Acatzingo', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (5, 'Acteopan', 'Valle de Atlixco y Matamoros');
INSERT INTO municipios (id, nombre, region) VALUES (6, 'Ahuacatlán', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (7, 'Ahuatlán', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (8, 'Ahuazotepec', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (9, 'Ahuehuetitla', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (10, 'Ajalpan', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (11, 'Albino Zertuche', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (12, 'Aljojuca', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (13, 'Altepexi', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (14, 'Amixtlán', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (15, 'Amozoc', 'Angelópolis');
INSERT INTO municipios (id, nombre, region) VALUES (16, 'Aquixtla', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (17, 'Atempan', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (18, 'Atexcal', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (19, 'Atlixco', 'Valle de Atlixco y Matamoros');
INSERT INTO municipios (id, nombre, region) VALUES (20, 'Atoyatempan', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (21, 'Atzala', 'Valle de Atlixco y Matamoros');
INSERT INTO municipios (id, nombre, region) VALUES (22, 'Atzitzihuacán', 'Valle de Atlixco y Matamoros');
INSERT INTO municipios (id, nombre, region) VALUES (23, 'Atzitzintla', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (24, 'Axutla', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (25, 'Ayotoxco de Guerrero', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (26, 'Calpan', 'Angelópolis');
INSERT INTO municipios (id, nombre, region) VALUES (27, 'Caltepec', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (28, 'Camocuautla', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (29, 'Caxhuacan', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (30, 'Coatepec', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (31, 'Coatzingo', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (32, 'Cohetzala', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (33, 'Cohuecan', 'Valle de Atlixco y Matamoros');
INSERT INTO municipios (id, nombre, region) VALUES (34, 'Coronango', 'Angelópolis');
INSERT INTO municipios (id, nombre, region) VALUES (35, 'Coxcatlán', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (36, 'Coyomeapan', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (37, 'Coyotepec', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (38, 'Cuapiaxtla de Madero', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (39, 'Cuautempan', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (40, 'Cuautinchán', 'Angelópolis');
INSERT INTO municipios (id, nombre, region) VALUES (41, 'Cuautlancingo', 'Angelópolis');
INSERT INTO municipios (id, nombre, region) VALUES (42, 'Cuayuca de Andrade', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (43, 'Cuetzalan del Progreso', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (44, 'Cuyoaco', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (45, 'Chalchicomula de Sesma', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (46, 'Chapulco', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (47, 'Chiautla', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (48, 'Chiautzingo', 'Angelópolis');
INSERT INTO municipios (id, nombre, region) VALUES (49, 'Chiconcuautla', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (50, 'Chichiquila', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (51, 'Chietla', 'Valle de Atlixco y Matamoros');
INSERT INTO municipios (id, nombre, region) VALUES (52, 'Chigmecatitlán', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (53, 'Chignahuapan', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (54, 'Chignautla', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (55, 'Chila', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (56, 'Chila de la Sal', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (57, 'Honey', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (58, 'Chilchotla', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (59, 'Chinantla', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (60, 'Domingo Arenas', 'Angelópolis');
INSERT INTO municipios (id, nombre, region) VALUES (61, 'Eloxochitlán', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (62, 'Epatlán', 'Valle de Atlixco y Matamoros');
INSERT INTO municipios (id, nombre, region) VALUES (63, 'Esperanza', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (64, 'Francisco Z. Mena', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (65, 'General Felipe Ángeles', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (66, 'Guadalupe', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (67, 'Guadalupe Victoria', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (68, 'Hermenegildo Galeana', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (69, 'Huaquechula', 'Valle de Atlixco y Matamoros');
INSERT INTO municipios (id, nombre, region) VALUES (70, 'Huatlatlauca', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (71, 'Huauchinango', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (72, 'Huehuetla', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (73, 'Huehuetlán el Chico', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (74, 'Huejotzingo', 'Angelópolis');
INSERT INTO municipios (id, nombre, region) VALUES (75, 'Hueyapan', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (76, 'Hueytamalco', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (77, 'Hueytlalpan', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (78, 'Huitzilan de Serdán', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (79, 'Huitziltepec', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (80, 'Atlequizayan', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (81, 'Ixcamilpa de Guerrero', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (82, 'Ixcaquixtla', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (83, 'Ixtacamaxtitlán', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (84, 'Ixtepec', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (85, 'Izúcar de Matamoros', 'Valle de Atlixco y Matamoros');
INSERT INTO municipios (id, nombre, region) VALUES (86, 'Jalpan', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (87, 'Jolalpan', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (88, 'Jonotla', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (89, 'Jopala', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (90, 'Juan C. Bonilla', 'Angelópolis');
INSERT INTO municipios (id, nombre, region) VALUES (91, 'Juan Galindo', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (92, 'Juan N. Méndez', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (93, 'Lafragua', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (94, 'Libres', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (95, 'La Magdalena Tlatlauquitepec', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (96, 'Mazapiltepec de Juárez', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (97, 'Mixtla', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (98, 'Molcaxac', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (99, 'Cañada Morelos', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (100, 'Naupan', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (101, 'Nauzontla', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (102, 'Nealtican', 'Valle de Atlixco y Matamoros');
INSERT INTO municipios (id, nombre, region) VALUES (103, 'Nicolás Bravo', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (104, 'Nopalucan', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (105, 'Ocotepec', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (106, 'Ocoyucan', 'Valle de Atlixco y Matamoros');
INSERT INTO municipios (id, nombre, region) VALUES (107, 'Olintla', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (108, 'Oriental', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (109, 'Pahuatlán', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (110, 'Palmar de Bravo', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (111, 'Pantepec', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (112, 'Petlalcingo', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (113, 'Piaxtla', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (114, 'Puebla', 'Angelópolis');
INSERT INTO municipios (id, nombre, region) VALUES (115, 'Quecholac', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (116, 'Quimixtlán', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (117, 'Rafael Lara Grajales', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (118, 'Los Reyes de Juárez', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (119, 'San Andrés Cholula', 'Angelópolis');
INSERT INTO municipios (id, nombre, region) VALUES (120, 'San Antonio Cañada', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (121, 'San Diego la Mesa Tochimiltzingo', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (122, 'San Felipe Teotlalcingo', 'Angelópolis');
INSERT INTO municipios (id, nombre, region) VALUES (123, 'San Felipe Tepatlán', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (124, 'San Gabriel Chilac', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (125, 'San Gregorio Atzompa', 'Valle de Atlixco y Matamoros');
INSERT INTO municipios (id, nombre, region) VALUES (126, 'San Jerónimo Tecuanipan', 'Valle de Atlixco y Matamoros');
INSERT INTO municipios (id, nombre, region) VALUES (127, 'San Jerónimo Xayacatlán', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (128, 'San José Chiapa', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (129, 'San José Miahuatlán', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (130, 'San Juan Atenco', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (131, 'San Juan Atzompa', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (132, 'San Martín Texmelucan', 'Angelópolis');
INSERT INTO municipios (id, nombre, region) VALUES (133, 'San Martín Totoltepec', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (134, 'San Matías Tlalancaleca', 'Angelópolis');
INSERT INTO municipios (id, nombre, region) VALUES (135, 'San Miguel Ixitlán', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (136, 'San Miguel Xoxtla', 'Angelópolis');
INSERT INTO municipios (id, nombre, region) VALUES (137, 'San Nicolás Buenos Aires', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (138, 'San Nicolás de los Ranchos', 'Valle de Atlixco y Matamoros');
INSERT INTO municipios (id, nombre, region) VALUES (139, 'San Pablo Anicano', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (140, 'San Pedro Cholula', 'Angelópolis');
INSERT INTO municipios (id, nombre, region) VALUES (141, 'San Pedro Yeloixtlahuaca', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (142, 'San Salvador el Seco', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (143, 'San Salvador el Verde', 'Angelópolis');
INSERT INTO municipios (id, nombre, region) VALUES (144, 'San Salvador Huixcolotla', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (145, 'San Sebastián Tlacotepec', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (146, 'Santa Catarina Tlaltempan', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (147, 'Santa Inés Ahuatempan', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (148, 'Santa Isabel Cholula', 'Valle de Atlixco y Matamoros');
INSERT INTO municipios (id, nombre, region) VALUES (149, 'Santiago Miahuatlán', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (150, 'Huehuetlán el Grande', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (151, 'Santo Tomás Hueyotlipan', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (152, 'Soltepec', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (153, 'Tecali de Herrera', 'Angelópolis');
INSERT INTO municipios (id, nombre, region) VALUES (154, 'Tecamachalco', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (155, 'Tecomatlán', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (156, 'Tehuacán', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (157, 'Tehuitzingo', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (158, 'Tenampulco', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (159, 'Teopantlán', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (160, 'Teotlalco', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (161, 'Tepanco de López', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (162, 'Tepango de Rodríguez', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (163, 'Tepatlaxco de Hidalgo', 'Angelópolis');
INSERT INTO municipios (id, nombre, region) VALUES (164, 'Tepeaca', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (165, 'Tepemaxalco', 'Valle de Atlixco y Matamoros');
INSERT INTO municipios (id, nombre, region) VALUES (166, 'Tepeojuma', 'Valle de Atlixco y Matamoros');
INSERT INTO municipios (id, nombre, region) VALUES (167, 'Tepetzintla', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (168, 'Tepexco', 'Valle de Atlixco y Matamoros');
INSERT INTO municipios (id, nombre, region) VALUES (169, 'Tepexi de Rodríguez', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (170, 'Tepeyahualco', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (171, 'Tepeyahualco de Cuauhtémoc', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (172, 'Tetela de Ocampo', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (173, 'Teteles de Ávila Castillo', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (174, 'Teziutlán', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (175, 'Tianguismanalco', 'Valle de Atlixco y Matamoros');
INSERT INTO municipios (id, nombre, region) VALUES (176, 'Tilapa', 'Valle de Atlixco y Matamoros');
INSERT INTO municipios (id, nombre, region) VALUES (177, 'Tlacotepec de Benito Juárez', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (178, 'Tlacuilotepec', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (179, 'Tlachichuca', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (180, 'Tlahuapan', 'Angelópolis');
INSERT INTO municipios (id, nombre, region) VALUES (181, 'Tlaltenango', 'Angelópolis');
INSERT INTO municipios (id, nombre, region) VALUES (182, 'Tlanepantla', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (183, 'Tlaola', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (184, 'Tlapacoya', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (185, 'Tlapanalá', 'Valle de Atlixco y Matamoros');
INSERT INTO municipios (id, nombre, region) VALUES (186, 'Tlatlauquitepec', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (187, 'Tlaxco', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (188, 'Tochimilco', 'Valle de Atlixco y Matamoros');
INSERT INTO municipios (id, nombre, region) VALUES (189, 'Tochtepec', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (190, 'Totoltepec de Guerrero', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (191, 'Tulcingo', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (192, 'Tuzamapan de Galeana', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (193, 'Tzicatlacoyan', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (194, 'Venustiano Carranza', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (195, 'Vicente Guerrero', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (196, 'Xayacatlán de Bravo', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (197, 'Xicotepec', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (198, 'Xicotlán', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (199, 'Xiutetelco', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (200, 'Xochiapulco', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (201, 'Xochiltepec', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (202, 'Xochitlán de Vicente Suárez', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (203, 'Xochitlán Todos Santos', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (204, 'Yaonáhuac', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (205, 'Yehualtepec', 'Valle de Serdán');
INSERT INTO municipios (id, nombre, region) VALUES (206, 'Zacapala', 'Mixteca');
INSERT INTO municipios (id, nombre, region) VALUES (207, 'Zacapoaxtla', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (208, 'Zacatlán', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (209, 'Zapotitlán', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (210, 'Zapotitlán de Méndez', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (211, 'Zaragoza', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (212, 'Zautla', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (213, 'Zihuateutla', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (214, 'Zinacatepec', 'Tehuacán y Sierra Negra');
INSERT INTO municipios (id, nombre, region) VALUES (215, 'Zongozotla', 'Sierra Norte');
INSERT INTO municipios (id, nombre, region) VALUES (216, 'Zoquiapan', 'Sierra Nororiental');
INSERT INTO municipios (id, nombre, region) VALUES (217, 'Zoquitlán', 'Tehuacán y Sierra Negra');
