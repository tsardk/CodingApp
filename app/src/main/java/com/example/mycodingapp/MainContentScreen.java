package com.example.mycodingapp;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.auth.FirebaseAuth;
import com.example.mycodingapp.R; // Added explicit R class import

public class MainContentScreen extends AppCompatActivity {

    private FirebaseAuth mAuth;
    private Button runButton;
    private Button logoutButton;
    private EditText codeArea;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main_content);

        mAuth = FirebaseAuth.getInstance();

        runButton = findViewById(R.id.button_run_code);
        logoutButton = findViewById(R.id.button_logout);
        codeArea = findViewById(R.id.edit_text_code_area);

        runButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String code = codeArea.getText().toString();
                Toast.makeText(MainContentScreen.this,
                        "Running code: " + code.substring(0, Math.min(code.length(), 20)) + "...",
                        Toast.LENGTH_SHORT).show();
            }
        });

        logoutButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mAuth.signOut();

                Intent intent = new Intent(MainContentScreen.this, LoginScreen.class);

                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);

                startActivity(intent);
                finish();
            }
        });
    }
}