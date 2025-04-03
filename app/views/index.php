<div class="startmenu" style="background-image: url('{{ asset('game/assets/sprites/sky.png') }}');">
    <div class="startmenu-overlay">
        <div class="startmenu-inner">
            <div class="startmenu-title">
                <h1>The Hortus Game</h1>

                <h2>A small jump & run game for free!</h2>
            </div>

            <div class="startmenu-actions">
                <a class="button button-start" href="{{ url('/play') }}">Start game</a>
            </div>

            <div class="startmenu-info">
                This game is powered by <a href="{{ env('LINK_HOMEPAGE') }}">HortusFox</a> - the selfhosted, collaborative management & tracking app for your indoor and outdoor plants.
            </div>

            <div class="startmenu-links">
                <div class="startmenu-links-item">
                    <a href="{{ env('LINK_GITHUB') }}"><i class="fab fa-github"></i></a>
                </div>

                <div class="startmenu-links-item">
                    <a href="{{ env('LINK_DISCORD') }}"><i class="fab fa-discord"></i></a>
                </div>

                <div class="startmenu-links-item">
                    <a href="{{ env('LINK_YOUTUBE') }}"><i class="fab fa-youtube"></i></a>
                </div>

                <div class="startmenu-links-item">
                    <a href="{{ env('LINK_FOSSVIDEO') }}"><i class="fas fa-video"></i></a>
                </div>

                <div class="startmenu-links-item">
                    <a href="{{ env('LINK_MASTODON') }}"><i class="fab fa-mastodon"></i></a>
                </div>

                <div class="startmenu-links-item">
                    <a href="{{ env('LINK_PIXELFED') }}"><i class="fas fa-camera"></i></a>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
    });
</script>
