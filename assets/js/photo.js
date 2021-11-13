var apigClient = apigClientFactory.newClient({ apikey:"K9hmPwB1zf2WU9Cls8cxb1SzdNu4dStp3FV75sX7"
});
var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition = new SpeechRecognition();

function searchByVoice(){
    if ('SpeechRecognition' in window) {
        console.log("Start SpeechRecognition");
    } else {
        console.log("Something Wrong with SpeechRecognition");
    }

    var inputQuery = document.getElementById("search_query");

    micButton = document.getElementById("mic_search");

    if (micButton.innerHTML == "mic") {
        recognition.start();
    } else if (micButton.innerHTML == "mic_off"){
        recognition.stop();
    }

    recognition.addEventListener("start", function() {
        micButton.innerHTML = "mic_off";
        console.log("Recording Now");
    });

    recognition.addEventListener("end", function() {
        console.log("Stopping recording");
        micButton.innerHTML = "mic";
    });

    recognition.addEventListener("result", function(event){
        const current = event.resultIndex;
        transcript = event.results[current][0].transcript;
        inputQuery.value = transcript;
        console.log("transcript : ", transcript)
    });
}




function searchByText() {
    var searchText = document.getElementById('search_query');

    console.log('query', searchText)
    if (!searchText.value) {
        alert('Please enter a valid text or voice input!');
    } else {
        searchText = searchText.value.trim().toLowerCase();
        console.log('Searching Photos....');
        searchPhotos(searchText);
    }

}



function searchPhotos(searchText) {

    console.log(searchText);
    document.getElementById('search_query').value = searchText;
    document.getElementById('photos_search_results').innerHTML = "<h4 style=\"text-align:center\">";

    var params = {
        'q' : searchText
    };

    apigClient.searchGet(params, {}, {})
        .then(function(result) {
            console.log("Result : ", result);
            // to do imagepaths, fixed!
            image_paths = result["data"]
            // image_paths = result["data"]["body"]["imagePaths"];
            console.log("image_paths : ", image_paths);

            var photosDiv = document.getElementById("photos_search_results");
            photosDiv.innerHTML = "";

            var n;
            for (n = 0; n < image_paths.length; n++) {
                images_list = image_paths[n].split('/');
                imageName = images_list[images_list.length - 1];

                photosDiv.innerHTML += '<figure><img src="' + image_paths[n] + '" style="width:25%"><figcaption>' + imageName + '</figcaption></figure>';
            }

        }).catch(function(result) {
            console.log(result);
        });
}


// function getBase64(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     // reader.onload = () => resolve(reader.result)
//     reader.onload = () => {
//       let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
//       if ((encoded.length % 4) > 0) {
//         encoded += '='.repeat(4 - (encoded.length % 4));
//       }
//       resolve(encoded);
//     };
//     reader.onerror = error => reject(error);
//   });
// }

function uploadPhoto()
{
   // var file_data = $("#file_path").prop("files")[0];
   var file = document.getElementById('uploaded_file').files[0];
   console.log("file is ")
   console.log(file)

   var data = file;


    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {
        console.log(this.responseText);
      }
    });


//     var params = {"photokey" : file.name, "x-amz-meta-customLabels": document.getElementById('custom_labels'), "Content-Type" : file.type};
//      var additionalParams = {
//             headers: {
//                 'Content-Type': file.type,
//                 'X-Api-Key': "K9hmPwB1zf2WU9Cls8cxb1SzdNu4dStp3FV75sX7"
// // });
//             }
//         };

    var param = '';
    let result = '';
    if (document.getElementById('custom_labels') != null){
        console.log("the document is ")
        console.log(document)
        result = "&x-amz-meta-customLabels=" + document.getElementById('custom_labels').value;
        console.log("metadatais ")
        console.log(result)

    }

    result = "photokey="+file.name + result;

    url = "https://4bo04a1soh.execute-api.us-east-1.amazonaws.com/v1/upload?"+ result + "&x-api-key=K9hmPwB1zf2WU9Cls8cxb1SzdNu4dStp3FV75sX7";

    xhr.open("PUT", url);
    console.log("put already");
    xhr.setRequestHeader("Content-Type", file.type);
    console.log("set header already");
    xhr.send(data);
    console.log('done');



}

