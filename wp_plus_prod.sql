--
-- PostgreSQL database dump
--

\restrict BlcFpOBM2bzmpiHjBeTXO1A5fLukKTD3yRGZwpmBQJWqNIu3HTT4aRU4usl14qE

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)

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
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: tich
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.ar_internal_metadata OWNER TO tich;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: tich
--

CREATE TABLE public.messages (
    id bigint NOT NULL,
    sender_id integer,
    receiver_id integer,
    project_id integer,
    content text,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.messages OWNER TO tich;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: tich
--

CREATE SEQUENCE public.messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO tich;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tich
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: tich
--

CREATE TABLE public.projects (
    id bigint NOT NULL,
    name character varying,
    location character varying,
    description text,
    accomplishment_goal text,
    why_matters text,
    attempts_so_far text,
    what_worked text,
    support_types text,
    ideal_outcome text,
    timeline date,
    team_composition character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    votes integer
);


ALTER TABLE public.projects OWNER TO tich;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: tich
--

CREATE SEQUENCE public.projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO tich;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tich
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: roadmap_ideas; Type: TABLE; Schema: public; Owner: tich
--

CREATE TABLE public.roadmap_ideas (
    id bigint NOT NULL,
    name character varying,
    submitter character varying,
    idea_type character varying,
    user_story text,
    votes integer DEFAULT 0,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.roadmap_ideas OWNER TO tich;

--
-- Name: roadmap_ideas_id_seq; Type: SEQUENCE; Schema: public; Owner: tich
--

CREATE SEQUENCE public.roadmap_ideas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roadmap_ideas_id_seq OWNER TO tich;

--
-- Name: roadmap_ideas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tich
--

ALTER SEQUENCE public.roadmap_ideas_id_seq OWNED BY public.roadmap_ideas.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: tich
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


ALTER TABLE public.schema_migrations OWNER TO tich;

--
-- Name: stories; Type: TABLE; Schema: public; Owner: tich
--

CREATE TABLE public.stories (
    id bigint NOT NULL,
    title character varying,
    author character varying,
    content text,
    votes integer DEFAULT 0,
    url character varying,
    tags character varying[] DEFAULT '{}'::character varying[],
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.stories OWNER TO tich;

--
-- Name: stories_id_seq; Type: SEQUENCE; Schema: public; Owner: tich
--

CREATE SEQUENCE public.stories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stories_id_seq OWNER TO tich;

--
-- Name: stories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tich
--

ALTER SEQUENCE public.stories_id_seq OWNED BY public.stories.id;


--
-- Name: training_offerings; Type: TABLE; Schema: public; Owner: tich
--

CREATE TABLE public.training_offerings (
    id bigint NOT NULL,
    topic character varying,
    description text,
    availability character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    votes integer DEFAULT 0
);


ALTER TABLE public.training_offerings OWNER TO tich;

--
-- Name: training_offerings_id_seq; Type: SEQUENCE; Schema: public; Owner: tich
--

CREATE SEQUENCE public.training_offerings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.training_offerings_id_seq OWNER TO tich;

--
-- Name: training_offerings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tich
--

ALTER SEQUENCE public.training_offerings_id_seq OWNED BY public.training_offerings.id;


--
-- Name: training_requests; Type: TABLE; Schema: public; Owner: tich
--

CREATE TABLE public.training_requests (
    id bigint NOT NULL,
    topic character varying,
    description text,
    status character varying DEFAULT 'pending'::character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    votes integer DEFAULT 0
);


ALTER TABLE public.training_requests OWNER TO tich;

--
-- Name: training_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: tich
--

CREATE SEQUENCE public.training_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.training_requests_id_seq OWNER TO tich;

--
-- Name: training_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tich
--

ALTER SEQUENCE public.training_requests_id_seq OWNED BY public.training_requests.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: tich
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying,
    email character varying,
    password_digest character varying,
    bio text,
    location character varying,
    expertise text,
    is_advisor boolean,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO tich;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: tich
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO tich;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tich
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: tich
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: tich
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: roadmap_ideas id; Type: DEFAULT; Schema: public; Owner: tich
--

ALTER TABLE ONLY public.roadmap_ideas ALTER COLUMN id SET DEFAULT nextval('public.roadmap_ideas_id_seq'::regclass);


--
-- Name: stories id; Type: DEFAULT; Schema: public; Owner: tich
--

ALTER TABLE ONLY public.stories ALTER COLUMN id SET DEFAULT nextval('public.stories_id_seq'::regclass);


--
-- Name: training_offerings id; Type: DEFAULT; Schema: public; Owner: tich
--

ALTER TABLE ONLY public.training_offerings ALTER COLUMN id SET DEFAULT nextval('public.training_offerings_id_seq'::regclass);


--
-- Name: training_requests id; Type: DEFAULT; Schema: public; Owner: tich
--

ALTER TABLE ONLY public.training_requests ALTER COLUMN id SET DEFAULT nextval('public.training_requests_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: tich
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: ar_internal_metadata; Type: TABLE DATA; Schema: public; Owner: tich
--

COPY public.ar_internal_metadata (key, value, created_at, updated_at) FROM stdin;
environment	development	2026-02-15 02:54:08.817469	2026-02-15 02:54:08.817474
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: tich
--

COPY public.messages (id, sender_id, receiver_id, project_id, content, created_at, updated_at) FROM stdin;
1	2	\N	1	Hi\n	2026-02-15 05:31:41.24183	2026-02-15 05:31:41.24183
2	2	\N	1	hi	2026-02-15 08:09:44.503088	2026-02-15 08:09:44.503088
3	2	\N	1	testing \r\n	2026-02-15 08:11:23.86231	2026-02-15 08:11:23.86231
4	2	\N	1	thank you\r\n	2026-02-15 09:27:23.148795	2026-02-15 09:27:23.148795
5	2	\N	2	hi	2026-02-15 14:28:38.783355	2026-02-15 14:28:38.783355
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: tich
--

COPY public.projects (id, name, location, description, accomplishment_goal, why_matters, attempts_so_far, what_worked, support_types, ideal_outcome, timeline, team_composition, created_at, updated_at, votes) FROM stdin;
2	Tech Training for Women	Kilifi, Kenya	Training women over 25 how to code and use AI to upskill	Train 25 women in basic coding	Women need digital skills for economic empowerment	Borrowed laptops, virtual sessions	High demand from community	Practical tips, Resource connections	25 women employed in tech roles	\N	Solo founder	2026-02-15 12:07:38.380111	2026-02-15 12:07:38.380111	45
3	Clean Water Initiative	Lagos, Nigeria	Providing clean water access to rural communities	Build 3 boreholes	Clean water is a basic need	Purchased water tanks	Community partnerships	Mentorship, Funding connections	5000 people with clean water	\N	Team of 3	2026-02-15 12:07:38.410219	2026-02-15 12:07:38.410219	38
4	Youth Education Program	Mumbai, India	After-school coding program for underserved youth	100 students enrolled	Digital skills create opportunities	Pilot with 10 students	Parent enthusiasm	Volunteers, Partnerships	50 students in internships	\N	Founding team of 2	2026-02-15 12:07:38.426007	2026-02-15 12:07:38.426007	52
5	Women's Health Clinic	Nairobi, Kenya	Mobile health clinic for rural women	Serve 1000 women	Healthcare access is limited	Partnered with local hospital	Word of mouth referrals	Medical supplies, Funding	Monthly mobile clinics	\N	Medical director + 2 volunteers	2026-02-15 12:07:38.441345	2026-02-15 12:07:38.441345	29
6	Sustainable Farming Project	Lima, Peru	Teaching organic farming techniques to local farmers	50 farmers trained	Sustainable farming increases income	Community workshops	Farmer testimonials	Agricultural expertise, Market access	Farmers exporting organic produce	\N	Agricultural specialist + 2 locals	2026-02-15 12:07:38.455529	2026-02-15 12:07:38.455529	33
7	Naijeria Toweett	Kikambala, Kilifi	Tetsing	tetsing	testing	testing	Tetsing	Practical tips, Resource connections	tetsing	2026-02-28	Solo	2026-02-15 14:42:48.011932	2026-02-15 14:42:48.011932	\N
\.


--
-- Data for Name: roadmap_ideas; Type: TABLE DATA; Schema: public; Owner: tich
--

COPY public.roadmap_ideas (id, name, submitter, idea_type, user_story, votes, created_at, updated_at) FROM stdin;
2	Multilingual Support	Aisha Ibrahim	Localization	As a non-English speaker, I want the site in my language so I can participate fully.	38	2026-02-15 08:49:19.877525	2026-02-15 08:49:19.877525
4	Video Introductions for Advisors	Sarah Chen	Feature	As a seeker, I want to watch short advisor intros to know who to contact.	19	2026-02-15 08:49:19.922751	2026-02-15 08:49:19.922751
5	Offline Mode	Tech Lead	Technical	As a user with intermittent connectivity, I want to use core features offline and sync later.	35	2026-02-15 08:49:19.948676	2026-02-15 08:49:19.948676
6	Advanced Search Filters	Product	Feature	As a seeker, I want to filter advisors by skill, location and availability.	28	2026-02-15 08:49:19.965921	2026-02-15 08:49:19.965921
7	Structured Mentorship Paths	Program Team	Program	As a user, I want guided mentorship tracks for common challenges so I can follow a roadmap.	22	2026-02-15 08:49:19.981253	2026-02-15 08:49:19.981253
8	Impact Measurement Toolkit	M&E Team	Feature	As a project lead, I want templates and dashboards to measure impact easily.	31	2026-02-15 08:49:20.0067	2026-02-15 08:49:20.0067
9	Donor Collaboration Space	Partnerships	Collaboration	As a funder, I want a private workspace to collaborate with grantees.	14	2026-02-15 08:49:20.025599	2026-02-15 08:49:20.025599
10	Accessibility Improvements	Accessibility Lead	UX	As a user with accessibility needs, I want WCAG-compliant options and adjustable text sizes.	17	2026-02-15 08:49:20.086118	2026-02-15 08:49:20.086118
3	Mobile-First Design	Dev Team	UX	As a mobile user in low-bandwidth areas, I need a streamlined mobile UI that loads quickly.	53	2026-02-15 08:49:19.902612	2026-02-15 08:49:19.902612
1	Peer Advisory Matching Algorithm	Alex Rivera	Feature	As a seeker, I want automatic matches with advisors so I can get help faster.	44	2026-02-15 08:49:19.848595	2026-02-15 08:49:19.848595
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: public; Owner: tich
--

COPY public.schema_migrations (version) FROM stdin;
20260215040228
20260215042848
20260215050641
20260215120000
20260215130000
20260215140000
20260215150000
20260215160000
20260215160001
\.


--
-- Data for Name: stories; Type: TABLE DATA; Schema: public; Owner: tich
--

COPY public.stories (id, title, author, content, votes, url, tags, created_at, updated_at) FROM stdin;
3	School pledge on ending child marriages	Education Champion	An inspiring initiative bringing communities together to protect children's futures through education.	52	https://www.worldpulse.org/story/school-pledge-on-ending-child-marriages--74761	{education,"child protection"}	2026-02-15 09:45:12.711053	2026-02-15 09:45:12.711053
4	A silent pain	Healing Activist	Exploring the hidden struggles many face and the importance of speaking up for support.	29	https://www.worldpulse.org/story/a-silent-pain-74788	{personal,struggle}	2026-02-15 09:45:12.740689	2026-02-15 09:45:12.740689
5	Peace is the dignity of every girl	Girls' Rights Advocate	Celebrating the inherent dignity and rights of girls worldwide in the pursuit of peace.	41	https://www.worldpulse.org/story/peace-is-the-dignity-of-every-girl-74792	{girls,peace,dignity}	2026-02-15 09:45:12.811086	2026-02-15 09:45:12.811086
6	When men do it, we are told to endure	Justice Seeker	Challenging gender inequalities and the double standards women face in society.	33	https://www.worldpulse.org/story/when-men-do-it-we-are-told-to-endure-74876	{gender,justice,endurance}	2026-02-15 09:45:12.834183	2026-02-15 09:45:12.834183
7	The eternal flame: A World Pulse Heroes Remembrance Day	Community Leader	Proposing a meaningful way to honor and remember the heroes making a difference worldwide.	27	https://www.worldpulse.org/story/the-eternal-flame-proposing-a-world-pulse-heroes-remembrance-day-74889	{commemoration,heroes,remembrance}	2026-02-15 09:45:12.864982	2026-02-15 09:45:12.864982
8	Why I joined World Pulse	Community Member	A personal account of why World Pulse became instrumental in connecting and empowering.	35	https://www.worldpulse.org/story/why-i-joined-world-pulse-74963	{community,motivation,connection}	2026-02-15 09:45:12.886761	2026-02-15 09:45:12.886761
9	Between silence and strength: The stigma toward divorced women in the Philippines	Women's Advocate	Addressing the stigma and discrimination faced by divorced and separated women in society.	44	https://www.worldpulse.org/story/between-silence-and-strength-the-stigma-toward-divorced-and-separated-filipinas-in-philip-74959	{divorce,stigma,women}	2026-02-15 09:45:12.916425	2026-02-15 09:45:12.916425
2	The trauma she endured: Silent tears never noticed	Resilience Speaker	A courageous account of overcoming trauma and breaking the silence surrounding mental health.	39	https://www.worldpulse.org/story/the-trauma-she-endurance-a-silent-tears-never-noticed-74731	{trauma,resilience}	2026-02-15 09:45:12.6909	2026-02-15 09:45:12.6909
1	I felt small, yet I knew something...	Global Advocate	A powerful reflection on personal empowerment and finding strength in moments of uncertainty.	47	https://www.worldpulse.org/story/i-felt-small-yet-i-knew-something-74730	{personal,empowerment}	2026-02-15 09:45:12.663419	2026-02-15 09:45:12.663419
\.


--
-- Data for Name: training_offerings; Type: TABLE DATA; Schema: public; Owner: tich
--

COPY public.training_offerings (id, topic, description, availability, created_at, updated_at, votes) FROM stdin;
1	Social Media Strategy	I can teach how to build an online presence for your cause.	Weekly	2026-02-15 10:13:43.893904	2026-02-15 10:13:43.893904	0
2	Financial Planning for NGOs	Expertise in budgeting and financial management for non-profits.	Monthly	2026-02-15 10:13:43.914052	2026-02-15 10:13:43.914052	0
3	Storytelling for Impact	Learn to tell compelling stories that inspire action.	Bi-weekly	2026-02-15 10:13:43.929745	2026-02-15 10:13:43.929745	0
\.


--
-- Data for Name: training_requests; Type: TABLE DATA; Schema: public; Owner: tich
--

COPY public.training_requests (id, topic, description, status, created_at, updated_at, votes) FROM stdin;
4	Coding for Newbies	Learn how to code 	pending	2026-02-15 10:30:43.295386	2026-02-15 10:30:43.295386	0
6	Coding for Newbies	I want to give people the skills they need	pending	2026-02-15 11:00:34.911872	2026-02-15 11:00:34.911872	0
7	Test from curl	Testing the form	pending	2026-02-15 11:02:57.134289	2026-02-15 11:02:57.134289	0
8	Coding for Newbies	tetsing 	pending	2026-02-15 11:06:03.731233	2026-02-15 11:06:03.731233	0
1	Digital Marketing Basics	I want to learn how to promote my community project online.	pending	2026-02-15 10:13:43.829783	2026-02-15 10:13:43.829783	1
2	Grant Writing	Looking for help writing compelling grant proposals.	pending	2026-02-15 10:13:43.844865	2026-02-15 10:13:43.844865	1
5	Test	Test desc	pending	2026-02-15 10:33:50.392426	2026-02-15 10:33:50.392426	1
3	Public Speaking	I need confidence to present my ideas to donors and stakeholders.	pending	2026-02-15 10:13:43.862981	2026-02-15 10:13:43.862981	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: tich
--

COPY public.users (id, name, email, password_digest, bio, location, expertise, is_advisor, created_at, updated_at) FROM stdin;
1	Test	test@test.com	$2a$12$Jrl9d/LE4DTGAKgqmDBGxuwmORkvVitC6Bldd5KYji73jbs8Ms4gm	\N	\N	\N	\N	2026-02-15 04:52:14.334565	2026-02-15 04:52:14.334565
2	Naijeria	naijeria@mamatech.co.ke	$2a$12$nAhnfGWysFJmaDJTfT4Fhusho65bB0ZFI8/GRRqS8B4v4J/PFnGbO	\N	Kenya	Tech	\N	2026-02-15 04:57:58.167569	2026-02-15 04:57:58.167569
\.


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tich
--

SELECT pg_catalog.setval('public.messages_id_seq', 5, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tich
--

SELECT pg_catalog.setval('public.projects_id_seq', 7, true);


--
-- Name: roadmap_ideas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tich
--

SELECT pg_catalog.setval('public.roadmap_ideas_id_seq', 10, true);


--
-- Name: stories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tich
--

SELECT pg_catalog.setval('public.stories_id_seq', 9, true);


--
-- Name: training_offerings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tich
--

SELECT pg_catalog.setval('public.training_offerings_id_seq', 3, true);


--
-- Name: training_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tich
--

SELECT pg_catalog.setval('public.training_requests_id_seq', 8, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tich
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: tich
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: tich
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: tich
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: roadmap_ideas roadmap_ideas_pkey; Type: CONSTRAINT; Schema: public; Owner: tich
--

ALTER TABLE ONLY public.roadmap_ideas
    ADD CONSTRAINT roadmap_ideas_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: tich
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: stories stories_pkey; Type: CONSTRAINT; Schema: public; Owner: tich
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_pkey PRIMARY KEY (id);


--
-- Name: training_offerings training_offerings_pkey; Type: CONSTRAINT; Schema: public; Owner: tich
--

ALTER TABLE ONLY public.training_offerings
    ADD CONSTRAINT training_offerings_pkey PRIMARY KEY (id);


--
-- Name: training_requests training_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: tich
--

ALTER TABLE ONLY public.training_requests
    ADD CONSTRAINT training_requests_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: tich
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: index_roadmap_ideas_on_idea_type; Type: INDEX; Schema: public; Owner: tich
--

CREATE INDEX index_roadmap_ideas_on_idea_type ON public.roadmap_ideas USING btree (idea_type);


--
-- Name: index_roadmap_ideas_on_votes; Type: INDEX; Schema: public; Owner: tich
--

CREATE INDEX index_roadmap_ideas_on_votes ON public.roadmap_ideas USING btree (votes);


--
-- Name: index_stories_on_tags; Type: INDEX; Schema: public; Owner: tich
--

CREATE INDEX index_stories_on_tags ON public.stories USING gin (tags);


--
-- Name: index_stories_on_votes; Type: INDEX; Schema: public; Owner: tich
--

CREATE INDEX index_stories_on_votes ON public.stories USING btree (votes);


--
-- PostgreSQL database dump complete
--

\unrestrict BlcFpOBM2bzmpiHjBeTXO1A5fLukKTD3yRGZwpmBQJWqNIu3HTT4aRU4usl14qE

