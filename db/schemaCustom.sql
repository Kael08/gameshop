PGDMP                      }            postgres    16.1    16.1     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    5    postgres    DATABASE     |   CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Russia.1251';
    DROP DATABASE postgres;
                postgres    false            �           0    0    DATABASE postgres    COMMENT     N   COMMENT ON DATABASE postgres IS 'default administrative connection database';
                   postgres    false    4817            �           0    0    DATABASE postgres    ACL     (   GRANT ALL ON DATABASE postgres TO ming;
                   postgres    false    4817                        3079    16384 	   adminpack 	   EXTENSION     A   CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;
    DROP EXTENSION adminpack;
                   false            �           0    0    EXTENSION adminpack    COMMENT     M   COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';
                        false    2            �            1259    98305    games    TABLE     ;  CREATE TABLE public.games (
    game_id integer NOT NULL,
    name character varying(255) NOT NULL,
    price numeric(10,2) NOT NULL,
    genres character varying(100)[] NOT NULL,
    game_img bytea NOT NULL,
    description text,
    rating character varying(100),
    developer character varying(100) NOT NULL
);
    DROP TABLE public.games;
       public         heap    postgres    false            �            1259    98304    games_id_seq    SEQUENCE     �   CREATE SEQUENCE public.games_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.games_id_seq;
       public          postgres    false    217            �           0    0    games_id_seq    SEQUENCE OWNED BY     B   ALTER SEQUENCE public.games_id_seq OWNED BY public.games.game_id;
          public          postgres    false    216            �            1259    139294 
   user_games    TABLE     d   CREATE TABLE public.user_games (
    user_info_id integer NOT NULL,
    game_id integer NOT NULL
);
    DROP TABLE public.user_games;
       public         heap    postgres    false            �            1259    139280    users_credential    TABLE     �   CREATE TABLE public.users_credential (
    user_credential_id integer NOT NULL,
    user_info_id integer NOT NULL,
    login character varying(100) NOT NULL,
    password character varying(100) NOT NULL
);
 $   DROP TABLE public.users_credential;
       public         heap    postgres    false            �            1259    139279 '   users_credetnial_user_credetnial_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_credetnial_user_credetnial_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 >   DROP SEQUENCE public.users_credetnial_user_credetnial_id_seq;
       public          postgres    false    221            �           0    0 '   users_credetnial_user_credetnial_id_seq    SEQUENCE OWNED BY     s   ALTER SEQUENCE public.users_credetnial_user_credetnial_id_seq OWNED BY public.users_credential.user_credential_id;
          public          postgres    false    220            �            1259    139267 
   users_info    TABLE     �   CREATE TABLE public.users_info (
    user_info_id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(100),
    image_data bytea,
    bio text
);
    DROP TABLE public.users_info;
       public         heap    postgres    false            �            1259    139266    users_info_user_info_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_info_user_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.users_info_user_info_id_seq;
       public          postgres    false    219            �           0    0    users_info_user_info_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.users_info_user_info_id_seq OWNED BY public.users_info.user_info_id;
          public          postgres    false    218            )           2604    98308    games game_id    DEFAULT     i   ALTER TABLE ONLY public.games ALTER COLUMN game_id SET DEFAULT nextval('public.games_id_seq'::regclass);
 <   ALTER TABLE public.games ALTER COLUMN game_id DROP DEFAULT;
       public          postgres    false    216    217    217            +           2604    139283 #   users_credential user_credential_id    DEFAULT     �   ALTER TABLE ONLY public.users_credential ALTER COLUMN user_credential_id SET DEFAULT nextval('public.users_credetnial_user_credetnial_id_seq'::regclass);
 R   ALTER TABLE public.users_credential ALTER COLUMN user_credential_id DROP DEFAULT;
       public          postgres    false    221    220    221            *           2604    139270    users_info user_info_id    DEFAULT     �   ALTER TABLE ONLY public.users_info ALTER COLUMN user_info_id SET DEFAULT nextval('public.users_info_user_info_id_seq'::regclass);
 F   ALTER TABLE public.users_info ALTER COLUMN user_info_id DROP DEFAULT;
       public          postgres    false    219    218    219            -           2606    98310    games games_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (game_id);
 :   ALTER TABLE ONLY public.games DROP CONSTRAINT games_pkey;
       public            postgres    false    217            9           2606    139298    user_games user_games_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.user_games
    ADD CONSTRAINT user_games_pkey PRIMARY KEY (user_info_id, game_id);
 D   ALTER TABLE ONLY public.user_games DROP CONSTRAINT user_games_pkey;
       public            postgres    false    222    222            5           2606    139285 &   users_credential users_credetnial_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public.users_credential
    ADD CONSTRAINT users_credetnial_pkey PRIMARY KEY (user_credential_id);
 P   ALTER TABLE ONLY public.users_credential DROP CONSTRAINT users_credetnial_pkey;
       public            postgres    false    221            7           2606    139287 2   users_credential users_credetnial_user_info_id_key 
   CONSTRAINT     u   ALTER TABLE ONLY public.users_credential
    ADD CONSTRAINT users_credetnial_user_info_id_key UNIQUE (user_info_id);
 \   ALTER TABLE ONLY public.users_credential DROP CONSTRAINT users_credetnial_user_info_id_key;
       public            postgres    false    221            /           2606    139278    users_info users_info_email_key 
   CONSTRAINT     [   ALTER TABLE ONLY public.users_info
    ADD CONSTRAINT users_info_email_key UNIQUE (email);
 I   ALTER TABLE ONLY public.users_info DROP CONSTRAINT users_info_email_key;
       public            postgres    false    219            1           2606    139274    users_info users_info_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.users_info
    ADD CONSTRAINT users_info_pkey PRIMARY KEY (user_info_id);
 D   ALTER TABLE ONLY public.users_info DROP CONSTRAINT users_info_pkey;
       public            postgres    false    219            3           2606    139276 "   users_info users_info_username_key 
   CONSTRAINT     a   ALTER TABLE ONLY public.users_info
    ADD CONSTRAINT users_info_username_key UNIQUE (username);
 L   ALTER TABLE ONLY public.users_info DROP CONSTRAINT users_info_username_key;
       public            postgres    false    219            ;           2606    139304 "   user_games user_games_game_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_games
    ADD CONSTRAINT user_games_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(game_id) ON DELETE CASCADE;
 L   ALTER TABLE ONLY public.user_games DROP CONSTRAINT user_games_game_id_fkey;
       public          postgres    false    4653    217    222            <           2606    139299 '   user_games user_games_user_info_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_games
    ADD CONSTRAINT user_games_user_info_id_fkey FOREIGN KEY (user_info_id) REFERENCES public.users_info(user_info_id) ON DELETE CASCADE;
 Q   ALTER TABLE ONLY public.user_games DROP CONSTRAINT user_games_user_info_id_fkey;
       public          postgres    false    219    222    4657            :           2606    139288 3   users_credential users_credetnial_user_info_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users_credential
    ADD CONSTRAINT users_credetnial_user_info_id_fkey FOREIGN KEY (user_info_id) REFERENCES public.users_info(user_info_id);
 ]   ALTER TABLE ONLY public.users_credential DROP CONSTRAINT users_credetnial_user_info_id_fkey;
       public          postgres    false    221    4657    219           