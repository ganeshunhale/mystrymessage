import { Html, Head, Preview, Heading, Section, Text, Button } from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
    username: string;
    otp: string;
}
const VerificationEmail: React.FC<VerificationEmailProps>=({ username, otp }) =>{
    return (
        <Html>
            <Head>
                <title>Verification Code</title>
            </Head>
            <Preview>Your verification code is here!</Preview>
            <Section style={{ padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9" }}>
                <Heading style={{ textAlign: "center", color: "#333" }}>Hello, {username}!</Heading>
                <Text style={{ fontSize: "16px", color: "#555", marginBottom: "20px" }}>
                    Thank you for signing up. Please use the verification code below to complete your registration:
                </Text>
                <Text style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center", margin: "20px 0", color: "#000" }}>
                    {otp}
                </Text>
                {/* <Button
                    href="#"
                    style={{
                        display: "block",
                        margin: "0 auto",
                        padding: "10px 20px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        textDecoration: "none",
                        borderRadius: "5px",
                        textAlign: "center",
                    }}
                >
                    Verify Now
                </Button> */}
                <Text style={{ fontSize: "14px", color: "#999", marginTop: "20px", textAlign: "center" }}>
                    If you did not request this code, please ignore this email.
                </Text>
            </Section>
        </Html>
    );
}
export default VerificationEmail;