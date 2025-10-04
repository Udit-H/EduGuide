# Install OS, JSON, and OpenAI libraries.
import os
import json
from gradient import Gradient

# Set your agent endpoint and access key as environment variables in your OS.
agent_endpoint = os.getenv("agent_endpoint") + "/api/v1/" 
agent_access_key = os.getenv("agent_access_key")

if _name_ == "_main_":
    client = OpenAI(
        base_url = "https://vasqia773x6f52c2nsl7efnc.agents.do-ai.run",
        api_key = "0B4ruDI4zI41ypeLKLQzFHBrsr_-Jiyu",
    )

    response = client.chat.completions.create(
        model = "n/a",
        messages = [{"role": "user", "content": "Can you provide the name of France's capital in JSON format."}],
        extra_body = {"include_retrieval_info": True}
    )

# Prints response's content and retrieval object.
    for choice in response.choices:
        print(choice.message.content)
    
    response_dict = response.to_dict()

    print("\nFull retrieval object:")
    print(json.dumps(response_dict["retrieval"], indent=2))