<?php 

class CmdGameBuildDebug implements Asatru\Commands\Command  {
    public function handle($args)
    {
        GameBuild::make(true);
    }
}