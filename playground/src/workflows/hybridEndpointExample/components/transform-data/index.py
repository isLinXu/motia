config = {
    "name": "Transform Data", 
    "endpoint": "python-agent",
    "subscribes": ["hybrid.validated"],
    "emits": ["hybrid.transformed"]
}

# Add a static counter at module level
instance_id = id(object())  # or random, e.g., random.randint(1, 10000)
invocation_count = 0

async def handler(input, emit):
    global invocation_count
    invocation_count += 1

    print(f"[Python:transform-data] instance_id={instance_id}, "
        f"invocation_count={invocation_count} | "
        f"Received input={input}")

    items = input["items"]
    # Transform each item
    transformed = [{
        **item,
        "value": item["value"] * 2 if "value" in item else None,
        "transformed_by": "python"
    } for item in items]
    
    await emit({
        "type": "hybrid.transformed",
        "data": {
            "items": transformed,
            "timestamp": input["timestamp"]
        }
    })