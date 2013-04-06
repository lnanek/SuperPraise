package com.superpraiseapp;

import org.apache.cordova.DroidGap;

import android.app.NotificationManager;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;

public class SuperPraiseActivity extends DroidGap {
		
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);  
        super.init();           
        super.loadUrl("file:///android_asset/www/index.html");
    }

}
