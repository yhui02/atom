package com.tbc.app.xuemall.util.encryption;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.security.MessageDigest;

/**
 * xuemall-parent
 * Created by Yohann on 15/9/29.
 */
public class AESForNodejs {
    public static final String DEFAULT_CODING = "utf-8";

    /**
     * 解密
     *
     * @param encrypted
     * @param seed
     * @return
     * @throws Exception
     */
    private static String decrypt(String encrypted, String seed) throws Exception {
        byte[] keyb = seed.getBytes(DEFAULT_CODING);
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] thedigest = md.digest(keyb);
        SecretKeySpec skey = new SecretKeySpec(thedigest, "AES");
        Cipher dcipher = Cipher.getInstance("AES");
        dcipher.init(Cipher.DECRYPT_MODE, skey);

        byte[] clearbyte = dcipher.doFinal(toByte(encrypted));
        return new String(clearbyte);
    }

    /**
     * 加密
     *
     * @param content
     * @param key
     * @return
     * @throws Exception
     */
    public static String encrypt(String content, String key) throws Exception {
        byte[] input = content.getBytes(DEFAULT_CODING);

        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] thedigest = md.digest(key.getBytes(DEFAULT_CODING));
        SecretKeySpec skc = new SecretKeySpec(thedigest, "AES");
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, skc);

        byte[] cipherText = new byte[cipher.getOutputSize(input.length)];
        int ctLength = cipher.update(input, 0, input.length, cipherText, 0);
        ctLength += cipher.doFinal(cipherText, ctLength);

        return parseByte2HexStr(cipherText);
    }

    /**
     * 字符串转字节数组
     *
     * @param hexString
     * @return
     * @author lmiky
     * @date 2014-2-25
     */
    private static byte[] toByte(String hexString) {
        int len = hexString.length() / 2;
        byte[] result = new byte[len];
        for (int i = 0; i < len; i++) {
            result[i] = Integer.valueOf(hexString.substring(2 * i, 2 * i + 2), 16).byteValue();
        }
        return result;
    }

    /**
     * 字节转16进制数组
     *
     * @param buf
     * @return
     * @author lmiky
     * @date 2014-2-25
     */
    private static String parseByte2HexStr(byte buf[]) {
        StringBuilder sb = new StringBuilder();
        for (byte aBuf : buf) {
            String hex = Integer.toHexString(aBuf & 0xFF);
            if (hex.length() == 1) {
                hex = '0' + hex;
            }
            sb.append(hex);
        }
        return sb.toString();
    }

    public static void main(String[] args) throws Exception {
        String key = "~!@#$%^&tbcHefei";

        String plainText = "{\"time\":1443493862691,\"sex\":\"SECRET\",\"corpCode\":\"cqrcpx\",\"userId\":\"fcap4cguiopkljhgfcvbnmh376fdycad\",\"mobile\":\"15000470009\"}";

        String sec = AESForNodejs.encrypt(plainText, key);
        System.out.println(sec);
        System.out.println(AESForNodejs.decrypt(sec, key));
    }
}

