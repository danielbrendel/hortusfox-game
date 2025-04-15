<?php

/**
 * Class Highscore
 */ 
class Highscore extends \Asatru\Database\Model {
    const HIGHSCORE_SELECTION_WEEKLY = 'weekly';
    const HIGHSCORE_SELECTION_ALLTIME = 'alltime';

    /**
     * @param $playername
     * @param $score
     * @return void
     * @throws \Exception
     */
    public static function addScore($playername, $score)
    {
        try {
            static::raw('INSERT INTO `@THIS` (playername, score) VALUES(?, ?)', [
                $playername, $score
            ]);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $limit
     * @return mixed
     * @throws \Exception
     */
    public static function getAllTime($limit = 10)
    {
        try {
            return static::raw('SELECT playername, score FROM `@THIS` ORDER BY score DESC LIMIT ' . $limit);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $limit
     * @return mixed
     * @throws \Exception
     */
    public static function getWeekly($limit = 10)
    {
        try {
            return static::raw('SELECT playername, score FROM `@THIS` WHERE created_at BETWEEN DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) AND NOW() ORDER BY score DESC LIMIT ' . $limit);
        } catch (\Exception $e) {
            throw $e;
        }
    }
}