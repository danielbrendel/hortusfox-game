<?php

/**
 * Class Utils
 */
class Utils {
    /**
     * @param $format
     * @return string
     */
    public static function weeklyRemaining($format = '%a days')
    {
        $now = Carbon::now();
        $nextMonday = Carbon::now()->next(Carbon::MONDAY)->startOfDay();
        $diff = $now->diff($nextMonday);

        return $diff->format($format);
    }
}
