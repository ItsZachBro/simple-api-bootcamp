var timer = document.getElementById('timer');
var startButton = document.getElementById('start');
var resetButton = document.getElementById('reset');
var videoDiv = document.getElementById('video');
var genreSelect = document.getElementById('genre-select');
var durationInput = document.getElementById('timer-duration');

var countdownIntervalId;
var videoApiUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDefinition=high&maxResults=50&q=';
var apiKey = 'AIzaSyByiEH3rHl1FTALhCjO6S940YwMGW1QL98';
var player;

function updateTimerDisplay(timeInSeconds) {
  var minutes = Math.floor(timeInSeconds / 60);
  var seconds = timeInSeconds % 60;

  timer.textContent = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
}

function showVideo() {
  var selectedGenre = genreSelect.value;
  var url = videoApiUrl + encodeURIComponent(selectedGenre) + '&key=' + apiKey;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      var randomIndex = Math.floor(Math.random() * data.items.length);
      var videoId = data.items[randomIndex].id.videoId;
      videoDiv.style.display = 'block';

      if (player) {
        player.loadVideoById(videoId);
      } else {
        player = new YT.Player(videoDiv, {
          videoId: videoId,
          height: 400,
          width: '100%',
          events: {
            'onReady': function(event) {
              event.target.playVideo();
            }
          }
        });
      }
    });
}

startButton.addEventListener('click', function() {
  if (countdownIntervalId) {
    return;
  }
  var timeInSeconds = durationInput.value * 60; // duration in minutes
  countdownIntervalId = setInterval(function() {
    timeInSeconds--;

    if (timeInSeconds <= 0) {
      clearInterval(countdownIntervalId);
      countdownIntervalId = null;
      showVideo();
    }

    updateTimerDisplay(timeInSeconds);
  }, 1000);

  startButton.disabled = true;
  resetButton.disabled = false;
});

resetButton.addEventListener('click', function() {
  clearInterval(countdownIntervalId);
  countdownIntervalId = null;
  updateTimerDisplay(durationInput.value * 60);
  startButton.disabled = false;
  resetButton.disabled = true;
  videoDiv.style.display = 'none';
});

function onYouTubeIframeAPIReady() {
  player = new YT.Player(videoDiv, {
    height: 400,
    width: '100%',
    videoId: '',
    events: {
      'onReady': function(event) {
        event.target.pauseVideo();
      }
    }
  });
}
