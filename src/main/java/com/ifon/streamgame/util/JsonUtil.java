package com.ifon.streamgame.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;

public class JsonUtil {

    private static final ObjectMapper mapper =
            new ObjectMapper()
                    .findAndRegisterModules();

    /**
     * 寫入 JSON
     */
    public static <T> void write(String path, T data) {

        File file = new File(path);

        try {

            // 自動建立資料夾
            File parent = file.getParentFile();

            if (parent != null && !parent.exists()) {
                parent.mkdirs();
            }

            mapper.writerWithDefaultPrettyPrinter()
                    .writeValue(file, data);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 讀取單一物件
     */
    public static <T> T read(String path, Class<T> clazz) {

        File file = new File(path);

        if (!file.exists()) {
            return null;
        }

        try {

            return mapper.readValue(file, clazz);

        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 讀取 List、Map 等泛型資料
     */
    public static <T> T read(
            String path,
            TypeReference<T> typeReference
    ) {

        File file = new File(path);

        if (!file.exists()) {
            return null;
        }

        try {

            return mapper.readValue(
                    file,
                    typeReference
            );

        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}