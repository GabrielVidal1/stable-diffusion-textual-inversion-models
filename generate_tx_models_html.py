# pip install html5print requests huggingface-hub Pillow
import datetime
import json
import requests
from huggingface_hub import HfApi

# Init some stuff before saving the time
api = HfApi()
models_list = []

# Save the time now before we do the hard work
dt = datetime.datetime.now()
tz = dt.astimezone().tzname()

# Get list of models under the sd-concepts-library organization

i = 0

for model in api.list_models(author="sd-concepts-library"):

    # if i > 5 : break # for testing

    model_name = model.modelId.replace('sd-concepts-library/', '')

    concept_images_urls = []
    restricted = False
    concept_type = ""
    token = ""

    try :
        files = api.list_repo_files(repo_id=model.modelId)
        concept_images_urls = [f'https://huggingface.co/{model.modelId}/resolve/main/{image}' for image in files if image.startswith('concept_images/')]
        concept_type = requests.get(f'https://huggingface.co/{model.modelId}/raw/main/type_of_concept.txt').text
        token = requests.get(f'https://huggingface.co/{model.modelId}/raw/main/token_identifier.txt').text
    except requests.exceptions.HTTPError:
        restricted = True
    
    models_list.append({
        "model_name": model_name,
        "model_link": f'https://huggingface.co/{model.modelId}/',
        "model_download_link": f'https://huggingface.co/sd-concepts-library/{model_name}/resolve/main/learned_embeds.bin',
        "concept_images_urls": concept_images_urls,
        "restricted": restricted,
        "concept_type": concept_type,
        "token": token
    })
    print(f'{i}: Added {concept_type} {model_name} (token {token})')
    i += 1

models_list.sort(key=lambda x: x.get("model_name"))

with open("models.json", "w") as outfile:
    json.dump(models_list, outfile)