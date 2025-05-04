<?php

/*
    Asatru PHP - Highscore Controller
*/

/**
 * This class represents your controller
 */
class HighscoreController extends BaseController {
    const HIGHSCORE_LAYOUT = 'layout';

    /**
     * Construct object
     * 
     * @return void
     */
	public function __construct()
    {
        parent::__construct(self::HIGHSCORE_LAYOUT);

        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
    }

    /**
	 * Handles URL: /highscore
	 * 
	 * @param Asatru\Controller\ControllerArg $request
	 * @return Asatru\View\ViewHandler
	 */
	public function highscore($request)
	{
		return parent::view(['content', 'highscore'], [
			'remaining' => Utils::weeklyRemaining()
		]);
	}

    /**
	 * Handles URL: /scores/list
	 * 
	 * @param Asatru\Controller\ControllerArg $request
	 * @return Asatru\View\JsonHandler
	 */
    public function list($request)
    {
        try {
            $what = $request->params()->query('what', Highscore::HIGHSCORE_SELECTION_WEEKLY);
            $device = $request->params()->query('device', null);

            if ($what === Highscore::HIGHSCORE_SELECTION_WEEKLY) {
                $scores = Highscore::getWeekly($device);
            } else if ($what === Highscore::HIGHSCORE_SELECTION_ALLTIME) {
                $scores = Highscore::getAllTime($device);
            }
            
            return json([
                'code' => 200,
                'data' => $scores->asArray(),
                'remaining' => Utils::weeklyRemaining()
            ]);
        } catch (\Exception $e) {
            return json([
                'code' => 500,
                'msg' => $e->getMessage()
            ]);
        }
    }

    /**
	 * Handles URL: /scores/add
	 * 
	 * @param Asatru\Controller\ControllerArg $request
	 * @return Asatru\View\JsonHandler
	 */
    public function add($request)
    {
        try {
            Ratelimit::interfere();

            $playername = $request->params()->query('playername', 'Unnamed player');
            $score = $request->params()->query('score', 0);
            $mobile = (bool)$request->params()->query('mobile', 0);

            Highscore::addScore(trim($playername), $score, $mobile);

            return json([
                'code' => 200
            ]);
        } catch (\Exception $e) {
            return json([
                'code' => 500,
                'msg' => $e->getMessage()
            ]);
        }
    }
}
