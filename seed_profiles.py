import boto3

# Connect to DynamoDB
dynamo = boto3.resource('dynamodb', region_name='us-west-2')

# Create the table
def create_table():
    try:
        table = dynamo.create_table(
            TableName='uoftverse-profiles',
            KeySchema=[
                {'AttributeName': 'profileid', 'KeyType': 'HASH'}
            ],
            AttributeDefinitions=[
                {'AttributeName': 'profileid', 'AttributeType': 'S'}
            ],
            BillingMode='PAY_PER_REQUEST'
        )
        table.wait_until_exists()
        print("Table created successfully!")
    except Exception as e:
        print(f"Table might already exist: {e}")

# Fill it with profiles
def seed_data():
    table = dynamo.Table('uoftverse-profiles')

    profiles = [
        {
            "profileid": "p1",
            "role": "professor",
            "name": "Prof. Berj Bardakjian",
            "department": "Electrical & Computer Engineering",
            "title": "Professor",
            "research_interests": ["Neural Engineering", "Biomedical Engineering", "Epilepsy Prediction", "Signal Processing"],
            "bio": "Professor in ECE and BME at UofT. Research interests include neural engineering, biological and artificial neural networks, electrical rhythmic activities of the brain, and prediction and control of epileptic seizures.",
            "skills": ["Biomarkers", "ECG", "Machine Learning", "Signal Processing"],
            "connections": ["p2", "p3", "s1", "s2"],
            "verified": True,
            "openings": 2
        },
        {
            "profileid": "p2",
            "role": "professor",
            "name": "Prof. Ashvin Goel",
            "department": "Electrical & Computer Engineering",
            "title": "Professor",
            "research_interests": ["Operating Systems", "Computer Security", "Distributed Systems", "Software Reliability"],
            "bio": "Research in operating systems and computer security, focused on building reliable and secure software systems.",
            "skills": ["C", "C++", "Systems Programming", "Security"],
            "connections": ["p1", "p3", "s2", "s3"],
            "verified": True,
            "openings": 1
        },
        {
            "profileid": "p3",
            "role": "professor",
            "name": "Prof. Deepa Kundur",
            "department": "Electrical & Computer Engineering",
            "title": "Professor & Chair",
            "research_interests": ["Cybersecurity", "Smart Grid", "Cyber-Physical Systems", "Signal Processing"],
            "bio": "Chair of ECE at UofT. Holds the Canada Research Chair in Cybersecurity of Critical Infrastructure. Research spans smart grid security and cyber-physical systems.",
            "skills": ["Signal Processing", "Network Security", "Machine Learning"],
            "connections": ["p2", "p4", "s1"],
            "verified": True,
            "openings": 2
        },
        {
            "profileid": "p4",
            "role": "professor",
            "name": "Prof. Olivier Trescases",
            "department": "Electrical & Computer Engineering",
            "title": "Professor",
            "research_interests": ["Power Electronics", "Electric Vehicles", "Battery Management", "Energy Storage"],
            "bio": "Co-director of the UofT Electric Vehicle Research Centre (UTEV). Research on high-power EV infrastructure, battery management and power electronics.",
            "skills": ["Power Electronics", "PCB Design", "MATLAB", "Embedded Systems"],
            "connections": ["p3", "s2", "s3"],
            "verified": True,
            "openings": 1
        },
        {
            "profileid": "p5",
            "role": "professor",
            "name": "Prof. Mark Jeffrey",
            "department": "Electrical & Computer Engineering",
            "title": "Assistant Professor",
            "research_interests": ["Computer Architecture", "Parallel Computing", "Hardware Systems", "Machine Learning Systems"],
            "bio": "Research in computer architecture and systems, focusing on parallelism to improve performance and efficiency. Previously Research Scientist at Facebook AI Research.",
            "skills": ["Computer Architecture", "C++", "Hardware Design", "Distributed Systems"],
            "connections": ["p2", "p3", "s1", "s3"],
            "verified": True,
            "openings": 3
        },
        {
            "profileid": "p6",
            "role": "professor",
            "name": "Prof. Shurui Zhou",
            "department": "Electrical & Computer Engineering",
            "title": "Assistant Professor",
            "research_interests": ["Software Engineering", "AI-Enabled Systems", "Open Source Collaboration", "Human-Computer Interaction"],
            "bio": "Research on helping globally distributed software teams collaborate more efficiently, especially in building AI-enabled systems and scientific software.",
            "skills": ["Software Engineering", "Python", "Empirical Research", "AI Systems"],
            "connections": ["p5", "s1", "s3"],
            "verified": True,
            "openings": 2
        },
        {
            "profileid": "s1",
            "role": "student",
            "name": "Noah Balatbat",
            "department": "Electrical & Computer Engineering",
            "title": "1st Year Undergraduate",
            "research_interests": ["AI/ML", "Robotics", "Chip Design"],
            "bio": "Looking for a summer research position in ML or robotics. Previously worked on autonomous vehicle perception.",
            "skills": ["Python", "AWS", "React", "C++"],
            "connections": ["p1", "p3", "s2"],
            "verified": True,
            "openings": 0
        },
        {
            "profileid": "s2",
            "role": "student",
            "name": "Iris Wang",
            "department": "Electrical & Computer Engineering",
            "title": "1st Year Undergraduate",
            "research_interests": ["AI/ML", "Medical Imaging", "Deep Learning"],
            "bio": "Undergraduate student with previous research experience under Prof. Bardakjian. Working on real-time tumour detection using edge-deployed CNNs.",
            "skills": ["Python", "C++", "AWS", "Node"],
            "connections": ["p1", "p2", "s1", "s3"],
            "verified": True,
            "openings": 0
        },
        {
            "profileid": "s3",
            "role": "student",
            "name": "Aisha Nkosi",
            "department": "Electrical & Computer Engineering",
            "title": "4th Year Undergraduate",
            "research_interests": ["Power Electronics", "Renewable Energy", "Control Systems"],
            "bio": "Capstone project on solar microgrid control. Looking for industry co-op or research in clean energy.",
            "skills": ["MATLAB", "Simulink", "Python", "PCB Design"],
            "connections": ["p4", "s2"],
            "verified": True,
            "openings": 0
        }
    ]

    for profile in profiles:
        table.put_item(Item=profile)
        print(f"Added {profile['name']}")

    print("All profiles seeded!")

seed_data()