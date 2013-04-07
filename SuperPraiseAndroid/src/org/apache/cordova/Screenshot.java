/**
 * Copyright (C) 2012 30ideas (http://30ide.as)
 * MIT licensed
 * 
 * @author Josemando Sobral
 * @created Jul 2nd, 2012.
 */
package org.apache.cordova;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.os.Environment;
import android.view.View;

public class Screenshot extends Plugin {

	@Override
	public PluginResult execute(String action, JSONArray args, String callbackId) {
		// starting on ICS, some WebView methods
		// can only be called on UI threads
		final Plugin that = this;
		final String id = callbackId;
		super.cordova.getActivity().runOnUiThread(new Runnable() {
			//@Override
			public void run() {
				View view = webView.getRootView();

				Bitmap bitmap = Bitmap.createBitmap(view.getWidth(), view.getHeight(), Bitmap.Config.RGB_565);
				Canvas canvas = new Canvas(bitmap);
				view.draw(canvas);
				
				try {
					File folder = new File(Environment.getExternalStorageDirectory(), "Pictures");
					if (!folder.exists()) {
						folder.mkdirs();
					}

					File f = new File(folder, "AppraiseBlaze.png");

					FileOutputStream fos = new FileOutputStream(f);
					bitmap.compress(Bitmap.CompressFormat.JPEG, 80, fos);
					bitmap.recycle();
					that.success(new PluginResult(PluginResult.Status.OK), id);

				} catch (IOException e) {
					that.success(new PluginResult(PluginResult.Status.IO_EXCEPTION, e.getMessage()), id);
				}
			}
		});
		
		PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
		result.setKeepCallback(true);
		return result;
	}

}
