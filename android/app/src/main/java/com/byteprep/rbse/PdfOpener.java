package com.byteprep.rbse;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.widget.Toast;

import androidx.core.content.FileProvider;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.Executors;

/**
 * Reusable utility to open PDF documents externally using the Android system Intent mechanism.
 * 
 * Flow:
 * 1. Checks if the PDF is a local file or remote URL.
 * 2. If remote URL: Downloads/caches the file into the app's cache directory.
 * 3. Obtains a content:// URI using AndroidX FileProvider.
 * 4. Launches an Intent.ACTION_VIEW with MIME type application/pdf and FLAG_GRANT_READ_URI_PERMISSION.
 * 5. Handles ActivityNotFoundException gracefully if no PDF viewer app is installed.
 */
public class PdfOpener {

    private static final String TAG = "PdfOpener";

    public static void openPdf(Context context, String pdfUrlOrPath) {
        if (pdfUrlOrPath == null || pdfUrlOrPath.trim().isEmpty()) {
            Toast.makeText(context, "invalid PDF location", Toast.LENGTH_SHORT).show();
            return;
        }

        if (pdfUrlOrPath.startsWith("http://") || pdfUrlOrPath.startsWith("https://")) {
            // Remote PDF URL -> Download and cache, then open via FileProvider
            downloadAndOpenPdf(context, pdfUrlOrPath);
        } else {
            // Local File Path
            File file = new File(pdfUrlOrPath);
            if (!file.exists()) {
                Toast.makeText(context, "PDF file not found locally", Toast.LENGTH_SHORT).show();
                return;
            }
            openLocalFile(context, file);
        }
    }

    public static void openPdf(Context context, Uri pdfUri) {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(pdfUri, "application/pdf");
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        try {
            context.startActivity(intent);
        } catch (ActivityNotFoundException e) {
            Log.e(TAG, "No PDF viewer app found", e);
            Toast.makeText(context, "PDF Viewer app required. Please install a PDF Viewer app.", Toast.LENGTH_LONG).show();
        }
    }

    private static void openLocalFile(Context context, File file) {
        try {
            String authority = context.getPackageName() + ".fileprovider";
            Uri contentUri = FileProvider.getUriForFile(context, authority, file);
            openPdf(context, contentUri);
        } catch (Exception e) {
            Log.e(TAG, "Error generating FileProvider content URI", e);
            Toast.makeText(context, "Failed to open PDF document", Toast.LENGTH_SHORT).show();
        }
    }

    private static void downloadAndOpenPdf(final Context context, final String urlString) {
        Toast.makeText(context, "Opening PDF in external PDF Viewer...", Toast.LENGTH_SHORT).show();

        Executors.newSingleThreadExecutor().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    URL url = new URL(urlString);
                    HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                    connection.setRequestMethod("GET");
                    connection.setConnectTimeout(15000);
                    connection.setReadTimeout(15000);
                    connection.connect();

                    if (connection.getResponseCode() != HttpURLConnection.HTTP_OK) {
                        throw new Exception("HTTP Response Code: " + connection.getResponseCode());
                    }

                    // Generate local filename from URL hash or name
                    String filename = "document_" + Math.abs(urlString.hashCode()) + ".pdf";
                    File cacheDir = new File(context.getCacheDir(), "pdf_docs");
                    if (!cacheDir.exists()) {
                        cacheDir.mkdirs();
                    }

                    final File pdfFile = new File(cacheDir, filename);

                    InputStream input = connection.getInputStream();
                    FileOutputStream output = new FileOutputStream(pdfFile);

                    byte[] buffer = new byte[4096];
                    int bytesRead;
                    while ((bytesRead = input.read(buffer)) != -1) {
                        output.write(buffer, 0, bytesRead);
                    }

                    output.close();
                    input.close();

                    new Handler(Looper.getMainLooper()).post(new Runnable() {
                        @Override
                        public void run() {
                            openLocalFile(context, pdfFile);
                        }
                    });

                } catch (final Exception e) {
                    Log.e(TAG, "Failed to download remote PDF", e);
                    new Handler(Looper.getMainLooper()).post(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(context, "Error opening PDF: " + e.getMessage(), Toast.LENGTH_LONG).show();
                        }
                    });
                }
            }
        });
    }
}
