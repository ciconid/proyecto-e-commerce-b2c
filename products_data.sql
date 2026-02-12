--
-- PostgreSQL database dump
--

\restrict oRx0V5BLJrmAnxjaGAY9d8F64UdbBXQi7TNI1LgWGXTgxfQt8go6QusXLRKSyWS

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

BEGIN;

-- tabla temporal con misma estructura
CREATE TEMP TABLE product_tmp AS
TABLE public."Product"
WITH NO DATA;

-- carga de datos en la temp
COPY product_tmp (
  id,
  name,
  description,
  price,
  stock,
  "imageUrl",
  "createdAt",
  "updatedAt"
) FROM stdin;
2bea78a6-5807-4988-adaf-a8024618739e	Gabinete Gamer RGB Noxi Hika Black X 4 Coolers RGB Vidrio Templado	Gabinete gamer con diseño RGB, panel lateral de vidrio templado y 4 coolers RGB incluidos.	54399	15	https://res.cloudinary.com/dufj9kvbq/image/upload/v1770864258/ecommerce-products/aqipepvgump8uei6c2kw.webp	2026-02-12 02:33:09.528	2026-02-12 02:44:21.687
51c8e015-f3b3-4fcf-848d-22e5ccbb3999	Placa Base Asrock A520M-HDV Negro	Placa base micro ATX compatible con procesadores AMD Ryzen, socket AM4, chipset A520.	93585	10	https://res.cloudinary.com/dufj9kvbq/image/upload/v1770864291/ecommerce-products/svb4prskukd2vtewvfug.webp	2026-02-12 02:33:09.528	2026-02-12 02:44:52.937
bfcc18d5-c4a3-480e-b2bd-72c31d3402ec	Computadora con mono	Una computadora	1000	100	https://res.cloudinary.com/dufj9kvbq/image/upload/v1770750391/ecommerce-products/hxxgvyyaa5adpdfmjquo.jpg	2026-02-10 18:48:13.285	2026-02-10 19:06:37.245
b7b542e1-ea92-42af-a1e4-2c538982ac2d	Mechanical Keyboard	RGB backlit mechanical keyboard with blue switches	89.5	40	https://res.cloudinary.com/dufj9kvbq/image/upload/v1770862098/ecommerce-products/hnfd7mtipwljfftjyne9.jpg	2026-01-23 00:26:44.31	2026-02-12 02:08:22.588
00ca6600-fc2f-4c7b-9b16-85414736ec50	Adaptador USB 3.0 a SATA 2.5 Discos Rígidos y Grabadoras	Cable adaptador USB 3.0 a SATA para conectar discos rígidos y grabadoras de 2.5 pulgadas.	6549	50	https://res.cloudinary.com/dufj9kvbq/image/upload/v1770864341/ecommerce-products/ioq4zuctvnqd25adjjrz.webp	2026-02-12 02:33:09.528	2026-02-12 02:45:43.066
76616d77-5834-4193-802e-0081bb591c0a	Tarjeta Gráfica Arktek Radeon RX 550 8GB GDDR5 128bit	Tarjeta gráfica AMD Radeon RX 550 con 8GB de memoria GDDR5 y bus de 128 bits.	364597	8	https://res.cloudinary.com/dufj9kvbq/image/upload/v1770864353/ecommerce-products/jiyxgkclmk3us3l8qnlg.webp	2026-02-12 02:33:09.528	2026-02-12 02:45:55.839
f5c5ea73-77fe-4271-8345-65f527718284	Pasta Térmica Arctic MX-6 4gr Rendimiento Extremo	Pasta térmica de alto rendimiento Arctic MX-6, presentación de 4 gramos, ideal para CPUs y GPUs.	9988	100	https://res.cloudinary.com/dufj9kvbq/image/upload/v1770864370/ecommerce-products/br8ehjv9jc94qu2rrtlq.webp	2026-02-12 02:33:09.528	2026-02-12 02:46:11.51
a66a44f8-c000-44c4-90eb-6dcfe3e6fc36	Noise Cancelling Headphones	Over-ear headphones with active noise cancellation	199	30	https://res.cloudinary.com/dufj9kvbq/image/upload/v1770864755/ecommerce-products/xmhwwo7snfp9w557xcc9.jpg	2026-01-23 01:34:41.284	2026-02-12 02:52:37.258
99292f18-501c-48fe-a299-2fb95b770797	27-inch Monitor	4K UHD monitor with IPS panel	399.99	22	https://res.cloudinary.com/dufj9kvbq/image/upload/v1770864784/ecommerce-products/d59mlvdziswegwrwr5gv.jpg	2026-01-23 00:27:11.437	2026-02-12 02:53:06.066
639251e1-efc2-4aaa-98f2-033fd8088aef	Laptop		999.99	4	https://res.cloudinary.com/dufj9kvbq/image/upload/v1770864819/ecommerce-products/xnw3kpyxfcb0vvpd9csc.jpg	2026-01-24 20:28:02.725	2026-02-12 02:53:40.865
\.

-- merge sin romper producción
INSERT INTO public."Product"
SELECT *
FROM product_tmp
ON CONFLICT (id) DO NOTHING;

COMMIT;

\unrestrict oRx0V5BLJrmAnxjaGAY9d8F64UdbBXQi7TNI1LgWGXTgxfQt8go6QusXLRKSyWS
