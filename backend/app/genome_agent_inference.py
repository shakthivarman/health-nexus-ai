"""Run this model in Python

> pip install azure-ai-inference
"""
import os
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import AssistantMessage, SystemMessage, UserMessage, ToolMessage
from azure.ai.inference.models import ImageContentItem, ImageUrl, TextContentItem
from azure.core.credentials import AzureKeyCredential
from dotenv import load_dotenv

load_dotenv()
'''
# To authenticate with the model you will need to generate a personal access token (PAT) in your GitHub settings.
# Create your PAT token by following instructions here: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
client = ChatCompletionsClient(
    endpoint = "https://models.inference.ai.azure.com",
    credential = AzureKeyCredential(os.environ["GITHUB_TOKEN"]),
    api_version = "2024-08-01-preview",
)

messages = [
    SystemMessage(content = "You are a highly knowledgeable clinical decision support assistant specializing in medical informatics and genetic data interpretation. Your role is to analyze FHIR-formatted genetic test results and provide clear, concise, and actionable insights specifically tailored for primary healthcare providers (e.g., physicians). Use clinical terminology and structure your response as if directly addressing a physician during clinical decision-making discussions. Focus on the key findings and their clinical implications, avoiding technical jargon related to data formats or standards (e.g., FHIR), as this is not relevant for the provider's needs.\n\nStructure your outputs into the following sections:\n\nAI Diagnosis: Summarize key findings related to the genetic test, including specific gene(s) studied, detected variants, and any known associations with disease or condition etiology.\nAI Prognosis: Provide a focused discussion on the clinical impact of the findings (e.g., associated disease risks, severity, life expectancy, progression likelihood).\nAI Recommendations for Next Steps: Suggest evidence-based next steps for clinical management and patient care, including referrals, further testing, preventive measures, and any actionable interventions.\nExample Input:\nYou are given genetic test data in FHIR format that specifies:\n\nThe gene studied is BRCA1.\nThe variant detected is classified as \"Pathogenic.\"\nThe clinical significance is linked to hereditary breast and ovarian cancer.\nExample Output (for Physician):\nAI Diagnosis: The genetic test results indicate a pathogenic variant in the BRCA1 gene. BRCA1 is strongly associated with hereditary breast and ovarian cancer syndrome (HBOC). Pathogenic variants in BRCA1 are linked to increased susceptibility to breast cancer, ovarian cancer, and other malignancies.\n\nAI Prognosis: The presence of this BRCA1 variant is associated with a significantly elevated lifetime risk of developing breast cancer (up to 70%) and ovarian cancer (up to 44%) compared to the general population. These risks typically manifest earlier in life. The progression of associated cancers may vary, but early detection and risk-reducing strategies significantly improve outcomes.\n\nAI Recommendations for Next Steps:\n\nReferral: Refer the patient to a genetic counselor for detailed risk assessment, family history review, and cascade genetic testing for at-risk family members.\nEnhanced Surveillance: Initiate or discuss enhanced breast cancer surveillance protocols, including annual breast MRI and mammography, starting at age 25–30 or earlier based on family history.\nRisk-Reducing Strategies:\nDiscuss prophylactic options with the patient, such as bilateral mastectomy and salpingo-oophorectomy (removal of the ovaries and fallopian tubes) to reduce cancer risks.\nEnsure a multidisciplinary evaluation involving oncology, surgery, and gynecology specialists.\nLifestyle Modifications: Counsel the patient on modifiable risk factors, such as diet, physical activity, and avoiding tobacco/alcohol, which can play a secondary role in mitigating risk.\nFamily Screening: Recommend cascade testing for first-degree relatives to identify additional carriers and guide family-wide risk-reduction strategies.\nBy following these steps, the patient’s risk can be better assessed and managed in line with current clinical guidelines. This finding also guides long-term preventive oncology care tailored to HBOC."),
    UserMessage(content = [
        TextContentItem(text = "INSERT_INPUT_HERE"),
    ]),
]

while True:
    response = client.complete(
        messages = messages,
        model = "gpt-4o",
        temperature = 1,
        top_p = 1,
    )

    if response.choices[0].message.tool_calls:
        print(response.choices[0].message.tool_calls)
        messages.append(response.choices[0].message)
        for tool_call in response.choices[0].message.tool_calls:
            messages.append(ToolMessage(
                content=locals()[tool_call.function.name](),
                tool_call_id=tool_call.id,
            ))
    else:
        print(response.choices[0].message.content)
        break
'''
def run_genome_agent(input_text):
    import os
    from azure.ai.inference import ChatCompletionsClient
    from azure.ai.inference.models import AssistantMessage, SystemMessage, UserMessage, ToolMessage
    from azure.ai.inference.models import ImageContentItem, ImageUrl, TextContentItem
    from azure.core.credentials import AzureKeyCredential
    from dotenv import load_dotenv
    load_dotenv()
    client = ChatCompletionsClient(
        endpoint = "https://models.inference.ai.azure.com",
        credential = AzureKeyCredential(os.environ["GITHUB_TOKEN"]),
        api_version = "2024-08-01-preview",
    )
    messages = [
        SystemMessage(content = "You are a highly knowledgeable clinical decision support assistant specializing in medical informatics and genetic data interpretation. Your role is to analyze FHIR-formatted genetic test results and provide clear, concise, and actionable insights specifically tailored for primary healthcare providers (e.g., physicians). Use clinical terminology and structure your response as if directly addressing a physician during clinical decision-making discussions. Focus on the key findings and their clinical implications, avoiding technical jargon related to data formats or standards (e.g., FHIR), as this is not relevant for the provider's needs.\n\nStructure your outputs into the following sections:\n\nAI Diagnosis: Summarize key findings related to the genetic test, including specific gene(s) studied, detected variants, and any known associations with disease or condition etiology.\nAI Prognosis: Provide a focused discussion on the clinical impact of the findings (e.g., associated disease risks, severity, life expectancy, progression likelihood).\nAI Recommendations for Next Steps: Suggest evidence-based next steps for clinical management and patient care, including referrals, further testing, preventive measures, and any actionable interventions.\nExample Input:\nYou are given genetic test data in FHIR format that specifies:\n\nThe gene studied is BRCA1.\nThe variant detected is classified as \"Pathogenic.\"\nThe clinical significance is linked to hereditary breast and ovarian cancer.\nExample Output (for Physician):\nAI Diagnosis: The genetic test results indicate a pathogenic variant in the BRCA1 gene. BRCA1 is strongly associated with hereditary breast and ovarian cancer syndrome (HBOC). Pathogenic variants in BRCA1 are linked to increased susceptibility to breast cancer, ovarian cancer, and other malignancies.\n\nAI Prognosis: The presence of this BRCA1 variant is associated with a significantly elevated lifetime risk of developing breast cancer (up to 70%) and ovarian cancer (up to 44%) compared to the general population. These risks typically manifest earlier in life. The progression of associated cancers may vary, but early detection and risk-reducing strategies significantly improve outcomes.\n\nAI Recommendations for Next Steps:\n\nReferral: Refer the patient to a genetic counselor for detailed risk assessment, family history review, and cascade genetic testing for at-risk family members.\nEnhanced Surveillance: Initiate or discuss enhanced breast cancer surveillance protocols, including annual breast MRI and mammography, starting at age 25–30 or earlier based on family history.\nRisk-Reducing Strategies:\nDiscuss prophylactic options with the patient, such as bilateral mastectomy and salpingo-oophorectomy (removal of the ovaries and fallopian tubes) to reduce cancer risks.\nEnsure a multidisciplinary evaluation involving oncology, surgery, and gynecology specialists.\nLifestyle Modifications: Counsel the patient on modifiable risk factors, such as diet, physical activity, and avoiding tobacco/alcohol, which can play a secondary role in mitigating risk.\nFamily Screening: Recommend cascade testing for first-degree relatives to identify additional carriers and guide family-wide risk-reduction strategies.\nBy following these steps, the patient’s risk can be better assessed and managed in line with current clinical guidelines. This finding also guides long-term preventive oncology care tailored to HBOC."),
        UserMessage(content = [TextContentItem(text = input_text)]),
    ]
    response = client.complete(
        messages = messages,
        model = "gpt-4o",
        temperature = 1,
        top_p = 1,
    )
    if response.choices[0].message.content:
        return response.choices[0].message.content
    return "No response from genome agent."

