import os
import json
import base64

mock_models = [
    "control_v11p_sd15_scribble",
    "control_v11p_sd15_lineart",
    "control_v11p_sd15s2_lineart_anime"
]


def get_mock_image(width=512, height=512):
    image_name = f"mock_image_{width}x{height}.png"
    image_path = os.path.join(os.path.dirname(__file__), image_name)
    with open(image_path, 'rb') as f:
        image = base64.b64encode(f.read())
    return image.decode()


def get_mock_data(config):
    is_batch = config["batch_size"] > 1
    is_single = config["batch_size"] == 1
    all_seeds = [i + config["seed"] for i in range(0, config["batch_size"])]

    info = {
        "prompt": config["prompt"],
        "all_prompts": [config["prompt"]] * config["batch_size"],
        "negative_prompt": config["negative_prompt"],
        "all_negative_prompts": [config["negative_prompt"]] * config["batch_size"],
        "seed": config["seed"],
        "all_seeds": all_seeds,
        "subseed": 2813829083,
        "all_subseeds": [2813829083] * config["batch_size"],
        "subseed_strength": 0,
        "width": config["width"],
        "height": config["height"],
        "sampler_name": "DPM++ 2M Karras",
        "cfg_scale": config["cfg_scale"],
        "steps": config["steps"],
        "batch_size": 1,
        "restore_faces": False,
        "face_restoration_model": None,
        "sd_model_hash": "cc6cb27103",
        "seed_resize_from_w": -1,
        "seed_resize_from_h": -1,
        "denoising_strength": 0.6,
        "extra_generation_params": {
            "ControlNet": "preprocessor: invert, model: control_v11p_sd15_scribble, weight: 0.6, starting/ending: (0.0, 1.0), resize mode: ResizeMode.INNER_FIT, pixel perfect: False, control mode: ControlMode.BALANCED, preprocessor params: (720, 64, 64)"
        }, 
        "index_of_first_image": 0,
        "infotexts": [
            "a castle\nNegative prompt: (worst quality,low quality,bad quality,normal quality:1.2)\nSteps: 16, Sampler: DPM++ 2M Karras, CFG scale: 7.0, Seed: 42, Size: 512x512, Model hash: cc6cb27103, Model: v1-5-pruned-emaonly, Seed resize from: -1x-1, Denoising strength: 0.6, ControlNet: \"preprocessor: invert, model: control_v11p_sd15_scribble, weight: 0.6, starting/ending: (0.0, 1.0), resize mode: ResizeMode.INNER_FIT, pixel perfect: False, control mode: ControlMode.BALANCED, preprocessor params: (720, 64, 64)\""
        ],
        "styles": [],
        "job_timestamp": "20230803202648",
        "clip_skip": 1,
        "is_using_inpainting_conditioning": False,
        "input_image": config["controlnet_units"][0]["input_image"]
    }

    result = {
        "info": json.dumps(info),
        "status_code": 200
    }

    image = get_mock_image(config["width"], config["height"])
    if is_single:
        result["image"] = image
    elif is_batch:
        result["batch_images"] = [image] * config["batch_size"]
    return result