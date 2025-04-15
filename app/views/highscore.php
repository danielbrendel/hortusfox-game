<div class="highscore" style="background-image: url('{{ asset('game/assets/sprites/sky.png') }}');">
    <div class="highscore-overlay">
        <div class="highscore-inner">
            <h1>Highscore</h1>

            <div class="highscore-selection">
                <span><a id="highscore-selection-alltime" href="javascript:void(0);" onclick="window.queryHighscoreList('alltime');">All Time</a></span>
                <span class="highscore-delimiter">|</span>
                <span><a id="highscore-selection-weekly" href="javascript:void(0);" onclick="window.queryHighscoreList('weekly');">Weekly ({{ $remaining }})</a></span>
            </div>

            <div class="highscore-list">
                <i class="fas fa-spinner fa-spin"></i>
            </div>

            <div class="">
                <a class="button button-back" href="{{ url('/') }}">Main menu</a>
            </div>
        </div>
    </div>
</div>

<script>
    window.queryHighscoreList = function(what) {
        window.highscoreSelection = what;

        if (what === '{{ Highscore::HIGHSCORE_SELECTION_WEEKLY }}') {
            document.querySelector('#highscore-selection-weekly').style.textDecoration = 'underline';
            document.querySelector('#highscore-selection-alltime').style.textDecoration = 'none';
        } else if (what === '{{ Highscore::HIGHSCORE_SELECTION_ALLTIME }}') {
            document.querySelector('#highscore-selection-weekly').style.textDecoration = 'none';
            document.querySelector('#highscore-selection-alltime').style.textDecoration = 'underline';
        }

        window.fetchHighscore('.highscore-list', window.highscoreSelection, '#highscore-selection-weekly');
    };

    document.addEventListener('DOMContentLoaded', function() {
        window.queryHighscoreList('{{ Highscore::HIGHSCORE_SELECTION_ALLTIME }}');
    });
</script>