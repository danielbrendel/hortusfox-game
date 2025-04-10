<div class="highscore" style="background-image: url('{{ asset('game/assets/sprites/sky.png') }}');">
    <div class="highscore-overlay">
        <div class="highscore-inner">
            <h1>Highscore</h1>

            <div class="highscore-list"></div>

            <div class="">
                <a class="button button-back" href="{{ url('/') }}">Main menu</a>
            </div>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        window.fetchHighscore('.highscore-list');
    });
</script>