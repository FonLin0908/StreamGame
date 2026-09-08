package com.ifon.streamgame;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TCJRepository extends JpaRepository<TwitchChannelJoin, Long> {
    @Query("SELECT t FROM TwitchChannelJoin t WHERE t.joinOrLeave = :status")
    List<TwitchChannelJoin> findByJoinOrLeave(@Param("status") String status);

    Optional<TwitchChannelJoin> findByChannelName(String channelName);
}