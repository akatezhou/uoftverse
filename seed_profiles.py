import boto3

dynamo = boto3.resource("dynamodb", region_name="us-west-2")

def seed_profiles():

    table = dynamo.Table("uoftverse-profiles")

    profiles = [

        {
            "id": "profile_p1",
            "entity": "profile",
            "role": "professor",
            "name": "Prof. Berj Bardakjian",
            "department": "Electrical & Computer Engineering",
            "title": "Professor",
            "email": "berj@ece.utoronto.ca",
            "research_interests": [
                "Neural Engineering",
                "Epilepsy Prediction",
                "Signal Processing"
            ],
            "bio": "Professor in ECE and BME researching neural engineering and brain signal analysis.",
            "skills": ["Machine Learning", "Signal Processing"],
            "verified": True,
            "openings": 2
        },

        {
            "id": "profile_p2",
            "entity": "profile",
            "role": "professor",
            "name": "Prof. Ashvin Goel",
            "department": "Electrical & Computer Engineering",
            "title": "Professor",
            "email": "goel@ece.utoronto.ca",
            "research_interests": [
                "Operating Systems",
                "Computer Security",
                "Distributed Systems"
            ],
            "bio": "Research in operating systems and computer security focusing on reliable systems.",
            "skills": ["C", "C++", "Systems Programming"],
            "verified": True,
            "openings": 1
        },

        {
            "id": "profile_p3",
            "entity": "profile",
            "role": "professor",
            "name": "Prof. Deepa Kundur",
            "department": "Electrical & Computer Engineering",
            "title": "Professor & Chair",
            "email": "kundur@ece.utoronto.ca",
            "research_interests": [
                "Cybersecurity",
                "Smart Grid",
                "Cyber-Physical Systems"
            ],
            "bio": "Chair of ECE at UofT and Canada Research Chair in Cybersecurity.",
            "skills": ["Network Security", "Signal Processing"],
            "verified": True,
            "openings": 2
        },

        {
            "id": "profile_p4",
            "entity": "profile",
            "role": "professor",
            "name": "Prof. Olivier Trescases",
            "department": "Electrical & Computer Engineering",
            "title": "Professor",
            "email": "trescases@ece.utoronto.ca",
            "research_interests": [
                "Power Electronics",
                "Electric Vehicles",
                "Battery Systems"
            ],
            "bio": "Co-director of the UofT Electric Vehicle Research Centre.",
            "skills": ["Power Electronics", "Embedded Systems"],
            "verified": True,
            "openings": 1
        },

        {
            "id": "profile_p5",
            "entity": "profile",
            "role": "professor",
            "name": "Prof. Mark Jeffrey",
            "department": "Electrical & Computer Engineering",
            "title": "Assistant Professor",
            "email": "mark.jeffrey@ece.utoronto.ca",
            "research_interests": [
                "Computer Architecture",
                "Parallel Computing",
                "Hardware Systems"
            ],
            "bio": "Research in computer architecture and parallel systems.",
            "skills": ["C++", "Hardware Design"],
            "verified": True,
            "openings": 3
        },

        {
            "id": "profile_p6",
            "entity": "profile",
            "role": "professor",
            "name": "Prof. Shurui Zhou",
            "department": "Electrical & Computer Engineering",
            "title": "Assistant Professor",
            "email": "shurui.zhou@ece.utoronto.ca",
            "research_interests": [
                "Software Engineering",
                "AI Systems",
                "Open Source Collaboration"
            ],
            "bio": "Research on collaboration tools for distributed AI software teams.",
            "skills": ["Python", "Software Engineering"],
            "verified": True,
            "openings": 2
        },

        {
            "id": "profile_s1",
            "entity": "profile",
            "role": "student",
            "name": "Noah Balatbat",
            "department": "Electrical & Computer Engineering",
            "title": "1st Year Undergraduate",
            "email": "noah@student.utoronto.ca",
            "research_interests": ["AI", "Robotics", "Chip Design"],
            "bio": "ECE student interested in machine learning and robotics research.",
            "skills": ["Python", "AWS", "React"],
            "verified": True,
            "openings": 0
        },

        {
            "id": "profile_s2",
            "entity": "profile",
            "role": "student",
            "name": "Iris Wang",
            "department": "Electrical & Computer Engineering",
            "title": "1st Year Undergraduate",
            "email": "iris.wang@student.utoronto.ca",
            "research_interests": ["AI", "Medical Imaging", "Deep Learning"],
            "bio": "Student researching tumour detection using edge deployed CNNs.",
            "skills": ["Python", "C++", "AWS"],
            "verified": True,
            "openings": 0
        },

        {
            "id": "profile_s3",
            "entity": "profile",
            "role": "student",
            "name": "Aisha Nkosi",
            "department": "Electrical & Computer Engineering",
            "title": "4th Year Undergraduate",
            "email": "aisha.nkosi@student.utoronto.ca",
            "research_interests": [
                "Renewable Energy",
                "Control Systems",
                "Power Electronics"
            ],
            "bio": "Capstone project on solar microgrid control systems.",
            "skills": ["MATLAB", "Simulink", "PCB Design"],
            "verified": True,
            "openings": 0
        }

    ]

    for p in profiles:
        table.put_item(Item=p)
        print("Added", p["name"])

seed_profiles()
