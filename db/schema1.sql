--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

-- Started on 2025-02-02 12:29:04

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

--
-- TOC entry 2 (class 3079 OID 16384)
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- TOC entry 4817 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 98305)
-- Name: games; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.games (
    game_id integer NOT NULL,
    name character varying(255) NOT NULL,
    price numeric(10,2) NOT NULL,
    genres character varying(100)[] NOT NULL,
    game_img bytea NOT NULL,
    description text,
    rating character varying(100),
    developer character varying(100) NOT NULL
);


ALTER TABLE public.games OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 98304)
-- Name: games_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.games_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.games_id_seq OWNER TO postgres;

--
-- TOC entry 4818 (class 0 OID 0)
-- Dependencies: 216
-- Name: games_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.games_id_seq OWNED BY public.games.game_id;


--
-- TOC entry 222 (class 1259 OID 139294)
-- Name: user_games; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_games (
    user_info_id integer NOT NULL,
    game_id integer NOT NULL
);


ALTER TABLE public.user_games OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 139280)
-- Name: users_credential; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_credential (
    user_credential_id integer NOT NULL,
    user_info_id integer NOT NULL,
    login character varying(100) NOT NULL,
    password character varying(100) NOT NULL
);


ALTER TABLE public.users_credential OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 139279)
-- Name: users_credetnial_user_credetnial_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_credetnial_user_credetnial_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_credetnial_user_credetnial_id_seq OWNER TO postgres;

--
-- TOC entry 4819 (class 0 OID 0)
-- Dependencies: 220
-- Name: users_credetnial_user_credetnial_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_credetnial_user_credetnial_id_seq OWNED BY public.users_credential.user_credential_id;


--
-- TOC entry 219 (class 1259 OID 139267)
-- Name: users_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_info (
    user_info_id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(100),
    image_data bytea,
    bio text
);


ALTER TABLE public.users_info OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 139266)
-- Name: users_info_user_info_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_info_user_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_info_user_info_id_seq OWNER TO postgres;

--
-- TOC entry 4820 (class 0 OID 0)
-- Dependencies: 218
-- Name: users_info_user_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_info_user_info_id_seq OWNED BY public.users_info.user_info_id;


--
-- TOC entry 4649 (class 2604 OID 98308)
-- Name: games game_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.games ALTER COLUMN game_id SET DEFAULT nextval('public.games_id_seq'::regclass);


--
-- TOC entry 4651 (class 2604 OID 139283)
-- Name: users_credential user_credential_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_credential ALTER COLUMN user_credential_id SET DEFAULT nextval('public.users_credetnial_user_credetnial_id_seq'::regclass);


--
-- TOC entry 4650 (class 2604 OID 139270)
-- Name: users_info user_info_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_info ALTER COLUMN user_info_id SET DEFAULT nextval('public.users_info_user_info_id_seq'::regclass);


--
-- TOC entry 4653 (class 2606 OID 98310)
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (game_id);


--
-- TOC entry 4665 (class 2606 OID 139298)
-- Name: user_games user_games_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_games
    ADD CONSTRAINT user_games_pkey PRIMARY KEY (user_info_id, game_id);


--
-- TOC entry 4661 (class 2606 OID 139285)
-- Name: users_credential users_credetnial_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_credential
    ADD CONSTRAINT users_credetnial_pkey PRIMARY KEY (user_credential_id);


--
-- TOC entry 4663 (class 2606 OID 139287)
-- Name: users_credential users_credetnial_user_info_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_credential
    ADD CONSTRAINT users_credetnial_user_info_id_key UNIQUE (user_info_id);


--
-- TOC entry 4655 (class 2606 OID 139278)
-- Name: users_info users_info_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_info
    ADD CONSTRAINT users_info_email_key UNIQUE (email);


--
-- TOC entry 4657 (class 2606 OID 139274)
-- Name: users_info users_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_info
    ADD CONSTRAINT users_info_pkey PRIMARY KEY (user_info_id);


--
-- TOC entry 4659 (class 2606 OID 139276)
-- Name: users_info users_info_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_info
    ADD CONSTRAINT users_info_username_key UNIQUE (username);


--
-- TOC entry 4667 (class 2606 OID 139304)
-- Name: user_games user_games_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_games
    ADD CONSTRAINT user_games_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(game_id) ON DELETE CASCADE;


--
-- TOC entry 4668 (class 2606 OID 139299)
-- Name: user_games user_games_user_info_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_games
    ADD CONSTRAINT user_games_user_info_id_fkey FOREIGN KEY (user_info_id) REFERENCES public.users_info(user_info_id) ON DELETE CASCADE;


--
-- TOC entry 4666 (class 2606 OID 139288)
-- Name: users_credential users_credetnial_user_info_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_credential
    ADD CONSTRAINT users_credetnial_user_info_id_fkey FOREIGN KEY (user_info_id) REFERENCES public.users_info(user_info_id);


-- Completed on 2025-02-02 12:29:04

--
-- PostgreSQL database dump complete
--

