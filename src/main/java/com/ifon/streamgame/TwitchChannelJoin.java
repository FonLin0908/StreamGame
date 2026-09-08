package com.ifon.streamgame;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "tcj")
public class TwitchChannelJoin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String channelName;
    private String joinOrLeave;
    private String pro;
}
