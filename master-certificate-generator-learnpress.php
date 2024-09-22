<?php
/**
Plugin Name: Master Certificate Generator
Plugin URI: https://seopage1.net
Description: Generate master course certificate after completing all course.
Author: SeoPage1
Version: 1.0.0
Author URI: https://seopage1.net
Text Domain: mcglearnpress
**/

function mcg_scripts() {
    global $current_user;
	wp_enqueue_style( 'mcg-style', plugin_dir_url(__FILE__).'/style.css' );
    
    wp_enqueue_script('pdfLib', 'https://unpkg.com/pdf-lib/dist/pdf-lib.min.js');
    wp_enqueue_script('fontkit', 'https://unpkg.com/@pdf-lib/fontkit@0.0.4');
	wp_enqueue_script( 'mcg-main-script', plugin_dir_url(__FILE__) . 'index.js', array(), '1.0.0', true );
    wp_enqueue_script( 'mcg-filesaver', plugin_dir_url(__FILE__) . 'filesaver.js', array(), '1.0.0', true );
    wp_localize_script('mcg-main-script','mcg_data',
        array(
            'has_membership' => pmpro_getMembershipLevelForUser($current_user->ID)?$current_user->membership_level->id:'',
            'start_date' => pmpro_getMembershipLevelForUser($current_user->ID)? date(get_option('date_format', pmpro_getMembershipLevelForUser($current_user->ID)->startdate)):'',
            'passed_course' => userPassedCourse(),
            'user_fullname' => pmpro_getMembershipLevelForUser($current_user->ID)?$current_user->first_name.' '.$current_user->last_name:'',
            'plugin_url' => plugin_dir_url(__FILE__),
        )
    );
}
add_action( 'wp_enqueue_scripts', 'mcg_scripts' );

function userPassedCourse(){

    $Course_Ids =  [4589, 4560, 4535, 3354, 3352, 3350, 3348, 3278, 3215, 3157];
    // $Course_Ids =  [3278];
    global $current_user;
    $profile = LP_Profile::instance( $current_user->ID );
    $Lpuser    = $profile->get_user();

    // $course_data    = $Lpuser->get_course_data( 3278 );
    // $grade          = $course_data->get_graduation();

    foreach($Course_Ids as $cid){
        $course_data    = $Lpuser->get_course_data( $cid );
        $grade          = $course_data->get_graduation();
        if($grade != 'passed'){
            return false;
        }
    }

    return true;
}

