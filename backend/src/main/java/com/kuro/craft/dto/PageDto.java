
package com.kuro.craft.dto;

import java.util.List;
import org.springframework.data.domain.Page;

public record PageDto<T>(
    List<T> content,
    int page,
    int size,
    long totalElements) {

  public static <T> PageDto<T> from(List<T> content, int page, int size, long totalElements) {
    return new PageDto<>(content, page, size, totalElements);
  }

  public static <T> PageDto<T> from(Page<T> springPage) {
    return new PageDto<>(
        springPage.getContent(),
        springPage.getNumber(),
        springPage.getSize(),
        springPage.getTotalElements());
  }
}
