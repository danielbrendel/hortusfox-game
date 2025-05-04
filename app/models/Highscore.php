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
     * @param $mobile
     * @return void
     * @throws \Exception
     */
    public static function addScore($playername, $score, $mobile)
    {
        try {
            static::raw('INSERT INTO `@THIS` (playername, score, mobile) VALUES(?, ?, ?)', [
                $playername, $score, $mobile
            ]);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $device
     * @param $limit
     * @return mixed
     * @throws \Exception
     */
    public static function getAllTime($device = null, $limit = 10)
    {
        try {
            if ($device === null) {
                return static::raw('SELECT playername, score, mobile FROM `@THIS` ORDER BY score DESC LIMIT ' . $limit);
            } else {
                return static::raw('SELECT playername, score, mobile FROM `@THIS` WHERE mobile = ? ORDER BY score DESC LIMIT ' . $limit, [(bool)$device]);
            }
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $device
     * @param $limit
     * @return mixed
     * @throws \Exception
     */
    public static function getWeekly($device = null, $limit = 10)
    {
        try {
            if ($device === null) {
                return static::raw('SELECT playername, score, mobile FROM `@THIS` WHERE created_at BETWEEN DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) AND NOW() ORDER BY score DESC LIMIT ' . $limit);
            } else {
                return static::raw('SELECT playername, score, mobile FROM `@THIS` WHERE mobile = ? AND created_at BETWEEN DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) AND NOW() ORDER BY score DESC LIMIT ' . $limit, [(bool)$device]);
            }
        } catch (\Exception $e) {
            throw $e;
        }
    }
}