import json
import base64
import pdb
import os

PATH = "game_saves/"
FILE = PATH+"bitburnerSave_1715960762_BN1x3.json"
OUT_FILE_DECODED = PATH+"bitburn-decoded.json"
OUT_FILE = PATH+"bitburn-out.json"

def getMostRecentFile():
    global OUT_FILE_DECODED
    global OUT_FILE
    # Get all json files in the game_saves directory
    json_files = [file for file in os.listdir("game_saves/") if file.endswith(".json")]

    # Find the file with the highest number at the end
    highest_number = -1
    highest_file = None
    for file in json_files:
        file_name = os.path.splitext(file)[0]
        try:
            number = int(file_name.split("_")[-2]) if len(file_name.split("_")) == 3 else -1 
            if number > highest_number:
                highest_number = number
                highest_file = file
                OUT_FILE_DECODED = "decoded_"+file
                OUT_FILE = "out_"+file
        except ValueError:
            pass
    print(highest_file)
    # Set the FILE variable to the path of the highest file
    return os.path.join(PATH, highest_file)
    
def main() -> None:

    
    FILE = getMostRecentFile()
    with open(FILE, "r") as f:
        data_b64 = f.read()

    data = base64.b64decode(data_b64)
    payload = json.loads(data)
    print("debugging...")
    # Alter the save file here:
    
    player_save = json.loads(payload["data"]["PlayerSave"])

    player_save["data"]["exploits"].append("EditSaveFile")
    # player_save["data"]["augmentations"].append({"level":1,"name":"BigD's Big ... Brain"})
    payload["data"]["PlayerSave"] = json.dumps(player_save)
    data = json.dumps(payload)
    
    with open(PATH+OUT_FILE_DECODED, "w") as f:
        f.write(data)
        

    data_b64 = base64.b64encode(data.encode('utf-8'))

    with open(PATH+OUT_FILE, "wb") as f:
        f.write(data_b64)


if __name__ == "__main__":
    main()
