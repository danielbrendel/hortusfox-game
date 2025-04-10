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
    if ((screen.orientation) && (screen.orientation.lock)) {
        screen.orientation.lock('landscape').catch((err) => {
            console.error('Failed to lock orientation to landscape: ', err);
        });
    }

    window.startGame = () => {
        gameconfig.physics.arcade.debug = {{ env('APP_DEBUG') ? 'true' : 'false' }};
        gameconfig.scale.width = {{ env('APP_GAMERESX', 1024) }};
        gameconfig.scale.height = {{ env('APP_GAMERESY', 768) }};
        const game = new Phaser.Game(gameconfig);
    };

    document.addEventListener('DOMContentLoaded', () => {
        window.startGame();
    });
</script>