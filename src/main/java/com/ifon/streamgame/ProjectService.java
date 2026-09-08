package com.ifon.streamgame;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {
    public List<String> getProjectModules() {
        return List.of("網頁控制面板", "數據統計", "Discord 連接器");
    }
}
