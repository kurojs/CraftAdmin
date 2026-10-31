package com.kuro.craft.dto;

import java.util.List;

public record SyncRequest(List<OnlinePlayerDto> online) {
}
