import json
import sqlite3

# Load patient data from genome_test_data.json
with open('./genome_test_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Extract patient entries
patients = []
observations = []
molecular_sequences = []
obs_genetic_variants = []
obs_pharmacogenomics = []
for entry in data['entry']:
    resource = entry.get('resource', {})
    if resource.get('resourceType') == 'Patient':
        patient_id = resource.get('id')
        identifier = resource.get('identifier', [{}])[0].get('value', '')
        name = resource.get('name', [{}])[0]
        family = name.get('family', '')
        given = ' '.join(name.get('given', []))
        gender = resource.get('gender', '')
        birth_date = resource.get('birthDate', '')
        address = resource.get('address', [{}])[0]
        city = address.get('city', '')
        state = address.get('state', '')
        country = address.get('country', '')
        patients.append((patient_id, identifier, family, given, gender, birth_date, city, state, country))
    elif resource.get('resourceType') == 'Observation':
        obs_id = resource.get('id')
        status = resource.get('status', '')
        category = resource.get('category', [{}])[0].get('coding', [{}])[0].get('code', '')
        code = resource.get('code', {}).get('coding', [{}])[0].get('display', '')
        subject = resource.get('subject', {}).get('reference', '')
        effective = resource.get('effectiveDateTime', '')
        value = ''
        if 'valueCodeableConcept' in resource:
            value = resource['valueCodeableConcept']['coding'][0].get('display', '')
        elif 'valueQuantity' in resource:
            value = str(resource['valueQuantity'].get('value', ''))
        elif 'valueString' in resource:
            value = resource['valueString']
        # Serialize the component field as JSON if present
        component_json = json.dumps(resource.get('component', []), ensure_ascii=False)
        observations.append((obs_id, status, category, code, subject, effective, value, component_json))
        # Genetic Variant Observations
        if code == 'Genetic variant assessment':
            gene = ''
            significance = ''
            for comp in resource.get('component', []):
                comp_code = comp.get('code', {}).get('coding', [{}])[0].get('display', '')
                if comp_code == 'Gene studied [ID]':
                    gene = comp.get('valueCodeableConcept', {}).get('coding', [{}])[0].get('display', '')
                if comp_code == 'Genetic variation clinical significance [Imp]':
                    significance = comp.get('valueCodeableConcept', {}).get('coding', [{}])[0].get('display', '')
            obs_genetic_variants.append((obs_id, subject, gene, significance, effective))
        # Pharmacogenomics Observations
        if code == 'Medication assessed [ID]':
            gene = ''
            phenotype = ''
            implication = ''
            for comp in resource.get('component', []):
                comp_code = comp.get('code', {}).get('coding', [{}])[0].get('display', '')
                if comp_code == 'Gene studied [ID]':
                    gene = comp.get('valueCodeableConcept', {}).get('coding', [{}])[0].get('display', '')
                if comp_code == 'Predicted phenotype':
                    phenotype = comp.get('valueCodeableConcept', {}).get('coding', [{}])[0].get('display', '')
                if comp_code == 'Therapeutic implication':
                    implication = comp.get('valueString', '')
            obs_pharmacogenomics.append((obs_id, subject, gene, phenotype, implication, effective))
    elif resource.get('resourceType') == 'MolecularSequence':
        seq_id = resource.get('id')
        seq_type = resource.get('type', '')
        patient_ref = resource.get('patient', {}).get('reference', '')
        chromosome = resource.get('referenceSeq', {}).get('chromosome', {}).get('coding', [{}])[0].get('display', '')
        genome_build = resource.get('referenceSeq', {}).get('genomeBuild', '')
        orientation = resource.get('referenceSeq', {}).get('orientation', '')
        window_start = resource.get('referenceSeq', {}).get('windowStart', '')
        window_end = resource.get('referenceSeq', {}).get('windowEnd', '')
        molecular_sequences.append((seq_id, seq_type, patient_ref, chromosome, genome_build, orientation, window_start, window_end))

# Create SQLite database and tables
conn = sqlite3.connect('patients.db')
c = conn.cursor()
c.execute('''
    CREATE TABLE IF NOT EXISTS patients (
        id TEXT PRIMARY KEY,
        identifier TEXT,
        family TEXT,
        given TEXT,
        gender TEXT,
        birth_date TEXT,
        city TEXT,
        state TEXT,
        country TEXT
    )
''')

#c.execute("ALTER TABLE observations ADD COLUMN component TEXT")

c.execute('''
    CREATE TABLE IF NOT EXISTS observations (
        id TEXT PRIMARY KEY,
        status TEXT,
        category TEXT,
        code TEXT,
        subject TEXT,
        effective TEXT,
        value TEXT,
        component TEXT
    )
''')
c.execute('''
    CREATE TABLE IF NOT EXISTS molecular_sequences (
        id TEXT PRIMARY KEY,
        type TEXT,
        patient_ref TEXT,
        chromosome TEXT,
        genome_build TEXT,
        orientation TEXT,
        window_start INTEGER,
        window_end INTEGER
    )
''')
c.execute('''
    CREATE TABLE IF NOT EXISTS obs_genetic_variants (
        obs_id TEXT,
        subject TEXT,
        gene TEXT,
        significance TEXT,
        effective TEXT
    )
''')
c.execute('''
    CREATE TABLE IF NOT EXISTS obs_pharmacogenomics (
        obs_id TEXT,
        subject TEXT,
        gene TEXT,
        phenotype TEXT,
        implication TEXT,
        effective TEXT
    )
''')

# Insert patient data
c.executemany('''
    INSERT OR REPLACE INTO patients (id, identifier, family, given, gender, birth_date, city, state, country)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
''', patients)
# Insert observation data
c.executemany('''
    INSERT OR REPLACE INTO observations (id, status, category, code, subject, effective, value, component)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
''', observations)
# Insert molecular sequence data
c.executemany('''
    INSERT OR REPLACE INTO molecular_sequences (id, type, patient_ref, chromosome, genome_build, orientation, window_start, window_end)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
''', molecular_sequences)
# Insert genetic variant observation data
c.executemany('''
    INSERT INTO obs_genetic_variants (obs_id, subject, gene, significance, effective)
    VALUES (?, ?, ?, ?, ?)
''', obs_genetic_variants)
# Insert pharmacogenomics observation data
c.executemany('''
    INSERT INTO obs_pharmacogenomics (obs_id, subject, gene, phenotype, implication, effective)
    VALUES (?, ?, ?, ?, ?, ?)
''', obs_pharmacogenomics)

conn.commit()
conn.close()
print(f"Inserted {len(patients)} patients, {len(observations)} observations, {len(molecular_sequences)} molecular sequences, {len(obs_genetic_variants)} genetic variant obs, and {len(obs_pharmacogenomics)} pharmacogenomics obs into patients.db.")
