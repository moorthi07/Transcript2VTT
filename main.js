(function ($) {

	var ready=false;
	var video;

	$("#submit_mp4").click(function () {
		var video_url = document.getElementById("mp4_url").value;
		var video_html='<source src="' + video_url + '"/>';
		$("#active_video").html(video_html);
		var video_width = $("#video_column").width();
		document.getElementById("active_video").style.width = ''+video_width-12;

		document.getElementById("mp4_submission").style.display = "none";
		document.getElementById("url_heads_up").style.display = "none";

		video = $("#active_video")[0];
		video.playbackRate= 1.75;
	});

	$("#submit_transcript").click(function () {
		var transcript_text=document.getElementById("transcript_entry").value;
		document.getElementById("transcript_submission").style.display = "none";
		document.getElementById("transcript_heads_up").style.display = "none";

		var parsed_transcript='';

		parsed_transcript += transcript_text;
		parsed_transcript = parsed_transcript.split('?').join('?</p><p>');
		parsed_transcript = parsed_transcript.split('!').join('!</p><p>');
		parsed_transcript = parsed_transcript.split(".").join(".</p><p>");
		parsed_transcript += "</p>";

		var sliced_transcript = parsed_transcript.split("</p><p>");
		parsed_slices=[];

		var id_count = 0;
		var id_tag="";

		for(i=0;i<sliced_transcript.length;i++){
			if(sliced_transcript[i].length>2 && sliced_transcript[i].charAt(0) != "\""){
				id_tag='</p><p>'+sliced_transcript[i];

				parsed_slices.push(id_tag);
				id_count++;
			}else{
				last_index = parsed_slices.length-1;
				parsed_slices[last_index]+=sliced_transcript[i];
			}
		}

		//check
		render_transcript=parsed_slices.join("");

		$("#transcript_renderer").html('<p>' + render_transcript+'</p>');
		checkReady();
	})

	$("#transcript_renderer").on("click",'p',function(){
		//if ready
			$(this).slideUp();
			var additive_text = "";
			current_timestamp = convert_timestamp(video.currentTime);
			additive_text+=current_timestamp + "\n" + this.textContent.replace(/\r?\n|\r/g,"") + "\n" + current_timestamp + " --> ";

			var vtt_text = document.getElementById("vtt_renderer").textContent + additive_text;
			document.getElementById("vtt_renderer").textContent=vtt_text;
		//else:
			//heads up
		})

		function onkp(){
			console.log(video.currentTime);
		}

	function convert_timestamp(seconds){

		return "" + ("0"+(Math.floor(seconds/3600)%60)).slice(-2)+":"+("0"+(Math.ceil(seconds/60)-1)%60).slice(-2) + ":" + ("0"+Math.ceil(seconds%60)).slice(-2)+ (seconds%Math.floor(seconds)).toPrecision(3).substring(1,5);
	}

	$("#download_vtt").click(function(){
		var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});//
		//saveAs(blob, "hello world.txt");	//
		this.download="helloworld.txt";
	})

	//code from https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
	function download(filename, text) {
   	var element = document.createElement('a');
    	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    	element.setAttribute('download', filename);
    	element.style.display = 'none';
    	document.body.appendChild(element);
    	element.click();
    	document.body.removeChild(element);
	}
	// Start file download.
	document.getElementById("download_vtt").addEventListener("click", function(){
    	// Generate download of hello.txt file with some content
    	var text = document.getElementById("vtt_renderer").textContent;
    	var filename = "tracks.vtt";
	   download(filename, text);
	}, false);

	function checkReady(){
		ready = true;
		document.getElementById("download_vtt").style.display = "block";
		setInterval(function(){
			video.play();
		}, 100);
	}

})(jQuery);
