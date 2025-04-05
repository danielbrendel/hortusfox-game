@if (env('APP_BACKBUTTON'))
<div class="action-go-back">
    <div class="action-go-back-inner">
        <a href="{{ url('/') }}">
            <i class="fas fa-arrow-left fa-2x"></i>
        </a>
    </div>
</div>
@endif

<script>
    window.startGame = () => {
        gameconfig.physics.arcade.debug = {{ env('APP_DEBUG') ? 'true' : 'false' }};
        const game = new Phaser.Game(gameconfig);
    };

    document.addEventListener('DOMContentLoaded', () => {
        window.startGame();
    });
</script>