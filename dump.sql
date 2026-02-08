--
-- PostgreSQL database dump
--

\restrict 3YZaaBneEiqRjMbXfr1ppRFx0e1RSUZLQ557fa5fKIJYWdCB9MFN7F4766PzXAn

-- Dumped from database version 15.15 (Debian 15.15-1.pgdg13+1)
-- Dumped by pg_dump version 15.15 (Debian 15.15-1.pgdg13+1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Cart" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Cart" OWNER TO postgres;

--
-- Name: CartItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CartItem" (
    id text NOT NULL,
    "cartId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer NOT NULL
);


ALTER TABLE public."CartItem" OWNER TO postgres;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "userId" text NOT NULL,
    total double precision NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Order" OWNER TO postgres;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderItem" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer NOT NULL,
    price double precision NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO postgres;

--
-- Name: Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Product" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    price double precision NOT NULL,
    stock integer NOT NULL,
    "imageUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Product" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    role text DEFAULT 'user'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "refreshToken" text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: Cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Cart" (id, "userId", "createdAt", "updatedAt") FROM stdin;
399f198a-90c1-47d2-af75-9f9c0863fb23	0cad8cf0-0ec2-43be-899a-e5f68c268ea6	2026-01-25 07:50:53.553	2026-01-25 07:50:53.553
6eec0e6d-acd4-4f58-bee5-5a0bb59a4dea	11bcd12b-2d13-4fef-be81-97bbfbc092b6	2026-01-27 05:50:28.609	2026-01-27 05:50:28.609
4a9d830a-0918-4168-9a47-4980d259dbb3	e5f50e0f-6cb1-4eb8-90e3-fbccf45171ad	2026-02-03 03:59:33.62	2026-02-03 03:59:33.62
\.


--
-- Data for Name: CartItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CartItem" (id, "cartId", "productId", quantity) FROM stdin;
24e2f821-dda8-48b1-823d-151c3225705b	4a9d830a-0918-4168-9a47-4980d259dbb3	99292f18-501c-48fe-a299-2fb95b770797	1
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Order" (id, "userId", total, status, "createdAt", "updatedAt") FROM stdin;
f0cd2e19-0f8e-40c6-9599-aa267fcfe06e	0cad8cf0-0ec2-43be-899a-e5f68c268ea6	4999.92	completada	2026-01-27 05:46:14.851	2026-01-27 05:50:05.022
64b97c36-f2c7-44c4-9513-81f553480082	11bcd12b-2d13-4fef-be81-97bbfbc092b6	799.98	pendiente	2026-01-27 05:50:58.714	2026-01-27 05:50:58.714
532c36ed-2ab7-4484-bf6a-10537e690d55	e5f50e0f-6cb1-4eb8-90e3-fbccf45171ad	1641.5	pendiente	2026-02-05 04:03:47.118	2026-02-05 04:03:47.118
37d1299e-fb53-47c8-9351-a4feb4fc6600	e5f50e0f-6cb1-4eb8-90e3-fbccf45171ad	399.99	completada	2026-02-05 05:01:13.395	2026-02-06 09:58:17.923
8d339122-2648-45f1-ac3e-4a694eb1af12	e5f50e0f-6cb1-4eb8-90e3-fbccf45171ad	378	cancelada	2026-02-05 05:00:53.685	2026-02-06 09:58:25.982
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderItem" (id, "orderId", "productId", quantity, price) FROM stdin;
4ea4e8fb-fef4-4ac7-800a-d60818647b73	f0cd2e19-0f8e-40c6-9599-aa267fcfe06e	639251e1-efc2-4aaa-98f2-033fd8088aef	3	999.99
85cf9ee7-9a65-49e4-b3c4-1f530661ad52	f0cd2e19-0f8e-40c6-9599-aa267fcfe06e	99292f18-501c-48fe-a299-2fb95b770797	5	399.99
df5b33fd-ae53-426b-b4a2-a5fa02e236e1	64b97c36-f2c7-44c4-9513-81f553480082	99292f18-501c-48fe-a299-2fb95b770797	2	399.99
906a0071-8712-42f2-b2a3-c3f6eba4665f	532c36ed-2ab7-4484-bf6a-10537e690d55	b7b542e1-ea92-42af-a1e4-2c538982ac2d	5	89.5
5004ef46-c15f-4692-b682-6e42b88a1f50	532c36ed-2ab7-4484-bf6a-10537e690d55	a66a44f8-c000-44c4-90eb-6dcfe3e6fc36	6	199
908d571d-2e1f-4d84-9e93-6e799923c053	8d339122-2648-45f1-ac3e-4a694eb1af12	a66a44f8-c000-44c4-90eb-6dcfe3e6fc36	1	199
d9e5862e-9a54-4b84-be86-3c3a9c3a1b5e	8d339122-2648-45f1-ac3e-4a694eb1af12	b7b542e1-ea92-42af-a1e4-2c538982ac2d	2	89.5
791c8608-3c13-4cbc-836f-9d150d668a2d	37d1299e-fb53-47c8-9351-a4feb4fc6600	99292f18-501c-48fe-a299-2fb95b770797	1	399.99
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Product" (id, name, description, price, stock, "imageUrl", "createdAt", "updatedAt") FROM stdin;
b7b542e1-ea92-42af-a1e4-2c538982ac2d	Mechanical Keyboard	RGB backlit mechanical keyboard with blue switches	89.5	40	https://picsum.photos/400/300	2026-01-23 00:26:44.31	2026-02-03 00:51:52.227
a66a44f8-c000-44c4-90eb-6dcfe3e6fc36	Noise Cancelling Headphones	Over-ear headphones with active noise cancellation	199	30	https://picsum.photos/400/300?random=1	2026-01-23 01:34:41.284	2026-02-03 00:52:37.54
99292f18-501c-48fe-a299-2fb95b770797	27-inch Monitor	4K UHD monitor with IPS panel	399.99	22	https://www.sourcesplash.com/i/random	2026-01-23 00:27:11.437	2026-02-03 00:53:04.213
639251e1-efc2-4aaa-98f2-033fd8088aef	Laptop		999.99	4	https://www.sourcesplash.com/i/random	2026-01-24 20:28:02.725	2026-02-06 04:35:47.914
c0db2deb-797b-4c81-94d4-b420c03fe830	El mejor producto	Un producto epico	1199	150	https://picsum.photos/400/300?random=1	2026-01-24 07:37:38.308	2026-02-06 04:36:12.897
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, password, name, role, "createdAt", "updatedAt", "refreshToken") FROM stdin;
0cad8cf0-0ec2-43be-899a-e5f68c268ea6	john@example.com	$2b$10$RB06W8XFptaEeoUwFpe8TeD.n08vwhqIW8fF8oLlQ16XTiIk2Xvs2	John Doe	user	2026-01-24 01:20:45.876	2026-01-27 23:02:53.014	$2b$10$no7rqrvND7CJPH35.rS0yebiyP1DKTqoe/eegzNaqYHktkXmwMdje
e5f50e0f-6cb1-4eb8-90e3-fbccf45171ad	chacho@gmail.com	$2b$10$Qxm1tXp0tv6QkIPfIMyHHucjXB54W9a6plALmg5OqOQkNuBehS6wu	ffdfd	user	2026-02-02 09:08:10.924	2026-02-06 10:54:39.269	$2b$10$3OIc7DGfxJu/pCURylw1I.W35GQcCslg25zgzLwbftB1Bx5DtoXBa
11bcd12b-2d13-4fef-be81-97bbfbc092b6	admin@ejemplo.com	$2b$10$XfUJeF708CfP2e6Ti4ThQOwxA8uWmtjQxyV5waHyORTq1jSUGNutu	admin	admin	2026-01-24 07:34:14.912	2026-02-07 04:45:40.151	$2b$10$oYN25CQXPR8DSll8kXnWO.gcmZj3OKcj48OjI6mzJNBqOX1D4Qyqi
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
8b0082de-f028-4a9c-943b-8003871afbd4	74d3f413626f90208a11446eaf4267eebebe9bab7ae7551a656b55ab14e3517d	2026-01-22 20:58:38.598781+00	20260122205838_init	\N	\N	2026-01-22 20:58:38.592577+00	1
d821a916-8c59-4c9c-b0b2-ec9b16acc12f	e4dba12f0883eeb3ab0843336675e4d30db969f5ebc779f90cb83c0aabfb7e40	2026-01-23 02:16:27.868352+00	20260123021627_add_user_model	\N	\N	2026-01-23 02:16:27.860488+00	1
4c18e7dd-0797-4885-b59b-631667b5561b	4b0d8c3eef928a4b302db71625a297b66e40237abc8c2fd5d6ba9c5f09a6b90f	2026-01-24 23:39:30.606361+00	20260124233930_add_cart_and_orders	\N	\N	2026-01-24 23:39:30.585041+00	1
0b3e2071-4e42-45d3-b2b7-6018986cc8ea	2a2a2f54d4839da57f849f96845d097bd0043356657b2efb78106d32612d6129	2026-01-27 21:57:40.787715+00	20260127215740_add_refresh_token	\N	\N	2026-01-27 21:57:40.783871+00	1
fd4bfe76-48a5-4f61-bd15-f937b2ffe876	2574af9da2fe8ea3c4b4e3967117f46094dae050bac70daf4693bc1fd139da24	2026-01-27 21:58:38.97226+00	20260127215838_fix_refresh_token_name	\N	\N	2026-01-27 21:58:38.967985+00	1
\.


--
-- Name: CartItem CartItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_pkey" PRIMARY KEY (id);


--
-- Name: Cart Cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: CartItem_cartId_productId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CartItem_cartId_productId_key" ON public."CartItem" USING btree ("cartId", "productId");


--
-- Name: Cart_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Cart_userId_key" ON public."Cart" USING btree ("userId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: CartItem CartItem_cartId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES public."Cart"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CartItem CartItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Cart Cart_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict 3YZaaBneEiqRjMbXfr1ppRFx0e1RSUZLQ557fa5fKIJYWdCB9MFN7F4766PzXAn

