package com.zulipmobile;

import com.facebook.react.ReactActivity;
import com.wix.reactnativenotifications.RNNotificationsPackage;
import com.github.droibit.android.reactnative.customtabs.CustomTabsPackage;
import com.smixx.fabric.FabricPackage;
import com.oblador.vectoricons.VectorIconsPackage;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ZulipMobile";
    }
}
